import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits to generate a website",
      });
    }

    // 🔹 Inject user prompt into master prompt
    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

    let raw = "";
    let parsed = null;

    // 🔹 Retry logic for AI response
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(finalPrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        raw = await generateResponse(
          finalPrompt + "\n\nRETURN ONLY RAW JSON."
        );
        parsed = await extractJson(raw);
      }
    }

    // 🔹 If AI fails
    if (!parsed || !parsed.code) {
      console.log("AI returned invalid response");
      return res.status(400).json({
        message: "AI returned invalid response",
      });
    }

    // 🔹 Save Website
    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: parsed.code,
      conversation: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "ai",
          content: parsed.message,
        },
      ],
    });

    // 🔹 Deduct credits AFTER success
    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error("Generate Website Error:", error);
    return res.status(500).json({
      message: "Server error while generating website",
    });
  }
};

export const getWebsiteById = async(req,res)=>{
    try {
        const website = await Website.findOne({
            _id:req.params.id,
            user:req.user._id
        })

        if(!website){
            return res.status(400).json({message:"website not found"})
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({message:`get website by id error ${error}`}) 
    }
}

export const changes = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const websiteId = req.params.id;

    const website = await Website.findOne({
      _id: websiteId,
      user: req.user._id,
    });

    if (!website) {
      return res.status(400).json({ message: "Website not found" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.credits < 25) {
      return res.status(400).json({
        message: "Not enough credits to make changes",
      });
    }

    // ✅ AI Prompt
    const updatePrompt = `
UPDATE THE HTML WEBSITE.

CURRENT CODE:
${website.latestCode}

USER PROMPT:
${prompt}

RETURN RAW JSON ONLY:
{
  "message":"Short confirmation",
  "code": "<UPDATED FULL HTML>"
}`;

    let raw = "";
    let parsed = null;

    // 🔹 Retry logic
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(updatePrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.");
        parsed = await extractJson(raw);
      }
    }

    // ❌ AI failed
    if (!parsed || !parsed.code) {
      return res.status(400).json({
        message: "AI returned invalid response",
      });
    }

    // ✅ Save conversation
    website.conversation.push(
      { role: "user", content: prompt },
      { role: "ai", content: parsed.message }
    );

    // ✅ Update code
    website.latestCode = parsed.code;

    await website.save();

    // ✅ Deduct credits
    user.credits -= 25;
    await user.save();

    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCredits: user.credits,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Update website error: ${error.message}`,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id });

    return res.status(200).json({
      success: true,
      websites
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching websites"
    });
  }
}; 

export const deploy = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!website) {
      return res.status(400).json({ message: "website not found" });
    }

    // create slug if not exists
    if (!website.slug) {
      website.slug =
        website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60) +
        website._id.toString().slice(-5);
    }

    // mark deployed
    website.deployed = true;

    // create deploy URL
    website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;

    await website.save();

    return res.status(200).json({
      url: website.deployUrl
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `deploy websites error ${error}` });
  }
};

export const getBySlug = async(req,res)=>{
  try {
    const website = await Website.findOne({
    slug: req.params.slug,
    user: req.user._id
  }) 
  if(!website){
    return res.status(400).json({message:"website not found"})
  }
  return res.status(200).json(website)

  } catch (error) {
    return res.status(500).json({message: `get by slug website error ${error}`})
  }

}