# User Testing & Feedback Collection Plan

## 1. Objectives of User Testing

The primary objectives of user testing for the Neighborhood Community WeChat Mini Program are:

*   **Usability of Core Features:**
    *   Assess the ease of use for all main modules: Home, Community (Groups, Posts), Group Buy (initiating, joining), Services (offering, requesting), and Profile.
    *   Identify any navigational difficulties or confusing UI elements.
*   **Understanding and Perception of the Trust System:**
    *   Evaluate if users understand how the `neighborhoodCreditScore` is calculated (conceptually).
    *   Assess if the display of trust scores and endorsements influences user behavior and decision-making (e.g., choosing a group buy initiator or service provider).
    *   Gauge user perception of the fairness and transparency of the trust system.
*   **Effectiveness of Inter-Module Synergy:**
    *   Test the usability and intuitiveness of features linking different modules (e.g., Community Event to Group Buy, Discussion to Service).
    *   Determine if these synergies provide real value to users.
*   **Identify Pain Points & Frustrations:**
    *   Uncover any areas where users struggle, get confused, or experience frustration.
*   **Validate Value Proposition:**
    *   Confirm that the mini-program provides a valuable service to the community and meets user needs.
    *   Gather insights into what features users value most and what might be missing.
*   **Bug Detection:**
    *   Identify functional bugs, typos, and other technical issues across different devices and scenarios.
*   **Gather Feature Requests & Improvement Ideas:**
    *   Collect suggestions for new features or improvements to existing ones.

## 2. Target User Profile & Recruitment

*   **Target User Profile:**
    *   **Primary:** Residents of a specific pilot neighborhood/community.
    *   **Demographics:** A diverse mix of:
        *   Age groups (e.g., young adults, families with children, seniors).
        *   Household types (e.g., singles, couples, families, retirees).
        *   Tech-savviness (from novice smartphone users to tech-savvy individuals).
        *   Roles within the community (e.g., active community participants, those new to the area, property management representatives if testing B2B features).
    *   **Psychographics:**
        *   Interested in local community engagement.
        *   Open to using digital tools for neighborhood interactions.
        *   Likely to participate in group purchasing or local service exchanges.
*   **Recruitment Methods:**
    *   **Pilot Community Focus:**
        *   **Flyers & Posters:** Distribute informative flyers/posters in common areas of the pilot community (e.g., elevators, notice boards, community center) with a QR code or link to a sign-up form.
        *   **Partnership with Property Management/Community Committee:** Collaborate with property management or the local community committee to announce the testing phase and invite residents.
        *   **Local Social Media Groups:** Post invitations in existing WeChat groups or other social media groups relevant to the pilot community.
        *   **Word-of-Mouth:** Encourage initial testers to refer other neighbors.
    *   **Broader Recruitment (for later phases):**
        *   Online advertisements targeted at specific geographic areas.
        *   Partnerships with local community organizations.
*   **Incentives for Participation (Optional & Ethical):**
    *   **Small Stipends/Gift Cards:** For participants in moderated testing sessions to compensate for their time.
    *   **Raffle/Prize Draw:** For participants who complete feedback surveys or report significant bugs.
    *   **Early Access & Recognition:** Acknowledge testers as "Founding Members" or provide early access to new features.
    *   **Community Contribution:** Frame participation as a way to improve their own neighborhood tool.
    *   **Transparency:** Clearly state any incentives upfront. Ensure incentives do not unduly bias feedback.

## 3. Testing Phases & Scope

*   **Phase 1: Alpha Testing (Internal / Friends & Family)**
    *   **Participants:** Core development team, extended team members, close friends, and family (ideally those fitting the broader target user profile).
    *   **Duration:** 1-2 weeks.
    *   **Scope:**
        *   Core functionality of all modules (Profile creation, Community group creation/posting, Group Buy initiation/joining, Service offering/requesting).
        *   Basic trust score display and profile editing.
        *   Initial bug hunting and major usability flaws.
        *   Testing on various devices (iOS, Android) and WeChat versions.
    *   **Goal:** Ensure the application is stable enough for external testers and identify glaring issues.

*   **Phase 2: Closed Beta Testing (Pilot Community)**
    *   **Participants:** 20-50 recruited residents from the pilot community, selected for diversity.
    *   **Duration:** 2-4 weeks.
    *   **Scope:**
        *   All features tested in Alpha.
        *   **Focus on usability of core user journeys.**
        *   **Detailed testing of the trust system:** Understanding score calculation (mocked), perception of endorsements, impact of trust scores on decision-making.
        *   Testing of inter-module synergy features (e.g., linking event to group buy).
        *   Gathering feedback on the overall user experience and value proposition.
        *   Collecting detailed bug reports and feature requests.
    *   **Goal:** Refine usability, validate the trust system's effectiveness, and gather in-depth qualitative feedback from real target users.

*   **Phase 3: Open Beta Testing (Wider Audience - Optional, if applicable)**
    *   **Participants:** Broader audience, potentially expanding to multiple neighborhoods or opening sign-ups more widely.
    *   **Duration:** 2-4 weeks or ongoing.
    *   **Scope:**
        *   All features.
        *   Stress testing the system with more users and data.
        *   Monitoring performance and scalability.
        *   Gathering feedback on broader appeal and identifying any new issues that emerge with scale.
        *   Continued bug reporting.
    *   **Goal:** Ensure stability and scalability, gather feedback from a larger user base, and prepare for a full launch.

## 4. Testing Methodologies

*   **Moderated Usability Testing (Primarily for Closed Beta):**
    *   **Process:** A facilitator guides users through predefined tasks one-on-one, either in person (in a community space) or remotely (via screen sharing in WeChat).
    *   **Benefits:** Allows for direct observation, follow-up questions, and deeper understanding of user behavior and reasoning.
    *   **Tools:** Observation checklist, recording (with consent).
*   **Unmoderated Usability Testing (For Beta phases, if tools allow):**
    *   **Process:** Users perform tasks on their own time, and their interactions might be recorded (if using specialized tools) or they self-report via surveys.
    *   **Benefits:** More natural environment for users, can test with more participants.
    *   **Tools:** For a mini-program, this might involve detailed task lists and post-task surveys rather than dedicated platforms. Screen recording apps (user-initiated) could be an option.
*   **Surveys & Questionnaires:**
    *   **Pre-Testing:** Gather demographic data, tech-savviness, and initial expectations.
    *   **Post-Task/Session:** Specific questions about the ease of completing tasks, clarity of information (e.g., "How easy was it to understand why your trust score changed?").
    *   **Post-Testing Phase:** Overall satisfaction, System Usability Scale (SUS), likelihood to recommend, feedback on trust system fairness, open-ended comments.
    *   **Tools:** WeChat's built-in survey tools, online survey platforms like Tencent Survey (问卷星) or SurveyMonkey.
*   **Think-Aloud Protocol (During Moderated Testing):**
    *   **Process:** Encourage users to verbalize their thoughts, actions, and feelings as they interact with the mini-program.
    *   **Benefits:** Provides rich qualitative insights into the user's mental model and decision-making process.
*   **Bug Reporting Channel:**
    *   **In-App Feedback Form:** A simple form within the mini-program (e.g., on the Profile page) to report bugs or issues. Fields: Description, Steps to Reproduce, Screenshot (optional).
    *   **Dedicated WeChat Group / Email:** For testers to report bugs, share screenshots/videos, and communicate with the testing coordinator.
*   **Feedback Forums/Groups (For Beta phases):**
    *   A dedicated WeChat group for beta testers to discuss their experiences, share feedback, and suggest features.
    *   This allows for peer-to-peer interaction and can surface common themes.

## 5. Key Tasks & Scenarios for Testing

Users will be given a set of scenarios and asked to complete tasks. Examples:

1.  **Onboarding & Profile:**
    *   "Imagine you've just heard about this app. Sign up and create your user profile."
    *   "Update your profile with a short bio and some interests."
    *   "Find where your Neighborhood Credit Score is displayed. What do you think it means?"
2.  **Community Module:**
    *   "Find and join the 'Gardening Club' community group."
    *   "Post a message in the 'Gardening Club' asking for advice on growing tomatoes."
    *   "You saw a post about a lost cat. Find the post and reply with some helpful information."
3.  **Group Buy Module:**
    *   "Your neighbor, '发起人张三' (a high-trust user), has initiated a group buy for 'Organic Apples'. Find this group buy and join it, ordering 2 boxes."
    *   "Imagine you want to buy fresh bread in bulk with your neighbors. Try to initiate a new group buy for 'Artisan Sourdough Bread'."
4.  **Services Module:**
    *   "You're good at fixing computers. Offer a 'Basic Computer Troubleshooting' service to your neighbors."
    *   "You need someone to help walk your dog this weekend. Find a 'Pet Sitting' or 'Dog Walking' service offered by a neighbor with a good trust score and send them a request."
5.  **Home Page & Synergy:**
    *   "Go to the Home page. What are the latest community announcements?"
    *   "From the Home page, find a highlighted group buy initiated by '雷锋邻居' and view its details."
    *   "You read an event post about a 'Community Cleanup Day'. The organizer wants to bulk buy gloves and trash bags. How would you help them set up a group buy for this?" (Tests Event-to-GroupBuy synergy concept)
6.  **Trust System Interactions:**
    *   "Another user (use a provided test account name) helped you with a task. Find their profile (simulated) and give them an endorsement for being 'Helpful'."
    *   "After joining the 'Organic Apples' group buy, check if your trust activity log shows anything (mocked entry)." (This requires mocking a log entry post-action)
    *   "You had an issue with a group buy. Find where you might report this issue."

## 6. Data Collection & Analysis

*   **Metrics:**
    *   **Quantitative:**
        *   Task Completion Rate (%).
        *   Time on Task (average time to complete).
        *   Error Rate (number of errors per task).
        *   System Usability Scale (SUS) scores (post-testing).
        *   Ratings on Likert scales for ease of use, trust perception, feature satisfaction.
        *   Number of bugs reported, categorized by severity.
    *   **Qualitative:**
        *   Direct quotes and user comments (from think-aloud, interviews, open-ended survey questions).
        *   Observed pain points and frustrations.
        *   Feedback on UI/UX design elements.
        *   Suggestions for improvements and new features.
        *   Themes emerging from feedback forums/groups.
*   **Categorization:**
    *   **Usability Issues:** (e.g., navigation, clarity, workflow) - Prioritized by severity (Critical, Major, Minor, Cosmetic).
    *   **Bugs:** Functional errors - Prioritized by severity.
    *   **Feature Requests:** New ideas from users.
    *   **Trust System Feedback:** Concerns, suggestions, and perceptions related to credit scores, endorsements, disputes.
    *   **Content & Wording:** Issues with clarity or appropriateness of text.
*   **Tools:**
    *   **Spreadsheets (Google Sheets, Excel):** For tracking participants, task completion, SUS scores, and collating qualitative feedback.
    *   **Dedicated Feedback Platform (Optional):** Tools like Jira (for bug tracking), Trello/Asana (for feature requests and usability issues), or dedicated user feedback tools (e.g., UserVoice, Canny) if budget allows.
    *   **WeChat Groups/Forms:** For direct communication and simple feedback submission.
    *   **Recording Tools:** For moderated sessions (with consent).

## 7. Feedback Loop & Iteration

*   **Communication:**
    *   **Daily/Regular Sync-ups:** During active testing phases, a brief daily meeting between the testing coordinator and key development team members to discuss critical issues.
    *   **Weekly Reports:** Summarize findings, new bugs, key feedback themes, and task completion metrics.
    *   **Shared Repository:** All collected data (notes, recordings, survey results, bug reports) stored in a central, accessible location (e.g., shared drive, wiki).
*   **Prioritization:**
    *   The product owner/manager, in consultation with development leads and UX designers, will prioritize issues and feedback based on:
        *   Severity of the issue (e.g., critical bugs blocking core functionality).
        *   Impact on user experience.
        *   Frequency of occurrence.
        *   Alignment with project goals and resources.
*   **Implementation & Re-testing:**
    *   Bugs and critical usability issues will be addressed by the development team in sprints.
    *   Changes and fixes will be deployed to a staging environment or the test version of the mini-program.
    *   **Regression Testing:** Ensure that fixes have not introduced new problems.
    *   **Re-testing:** Specific tasks or areas where major issues were found should be re-tested with a few users to confirm resolution.
    *   Larger design changes or new features based on feedback will go through their own mini design-develop-test cycle.
*   **Communicating Back to Testers:**
    *   Acknowledge received feedback.
    *   Inform testers (especially in Closed Beta) about significant changes made based on their input to show their contribution is valued.

This plan provides a framework. Specific details (e.g., exact number of testers, precise wording of survey questions) will be refined as the mini-program approaches each testing phase.I have created the `user_testing_plan.md` file with a comprehensive plan covering all the requested aspects.

**Summary of `user_testing_plan.md`:**

1.  **Objectives of User Testing:**
    *   Defined goals such as assessing usability of core features (Home, Community, Group Buy, Services, Profile), understanding the trust system (`neighborhoodCreditScore`, endorsements), evaluating inter-module synergy, identifying pain points, validating value proposition, bug detection, and gathering feature requests.

2.  **Target User Profile & Recruitment:**
    *   **Ideal Testers:** Residents of a pilot community, diverse in age, household type, and tech-savviness.
    *   **Recruitment:** Suggested methods like flyers, partnership with property management, local social media groups for the pilot community, and broader methods for later phases.
    *   **Incentives:** Considered small stipends, raffles, early access, or framing participation as community contribution.

3.  **Testing Phases & Scope:**
    *   **Alpha Testing (Internal/Friends & Family):** Initial bug hunting, core functionality checks.
    *   **Closed Beta Testing (Pilot Community):** Focus on usability, trust system perception, core module interactions with 20-50 real users.
    *   **Open Beta Testing (Wider Audience, Optional):** Stress testing, scalability, broader appeal.
    *   Defined features to be tested in each phase.

4.  **Testing Methodologies:**
    *   **Moderated Usability Testing:** One-on-one observation for in-depth insights.
    *   **Unmoderated Usability Testing:** Users test independently (adapted for mini-programs).
    *   **Surveys & Questionnaires:** Pre- and post-testing for quantitative data and subjective feedback (SUS mentioned).
    *   **Think-Aloud Protocol:** Users verbalize thoughts during moderated sessions.
    *   **Bug Reporting:** Clear channels like in-app forms or dedicated groups.
    *   **Feedback Forums/Groups:** For discussion and feature suggestions.

5.  **Key Tasks & Scenarios for Testing:**
    *   Provided a list of specific tasks covering onboarding, profile completion, understanding credit score, community group interaction, group buy initiation/joining, service offering/requesting, Home page navigation, inter-module synergy, and trust system interactions like endorsements.

6.  **Data Collection & Analysis:**
    *   **Metrics:** Task completion rates, time on task, error rates, SUS scores, qualitative feedback themes.
    *   **Categorization:** Usability issues, bugs, feature requests, trust system concerns, content issues – prioritized by severity.
    *   **Tools:** Spreadsheets, optional dedicated feedback tools, WeChat groups.

7.  **Feedback Loop & Iteration:**
    *   **Communication:** Daily/weekly sync-ups and reports to the development team.
    *   **Prioritization:** Based on severity, user impact, frequency, and project goals.
    *   **Implementation & Re-testing:** Addressed in sprints, followed by regression testing and re-testing of fixed issues.
    *   **Communicating Back:** Acknowledging feedback and informing testers of changes.

The document is structured as a practical guide for planning and executing user testing for the Neighborhood Community WeChat Mini Program.
