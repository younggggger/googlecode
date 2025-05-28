# Cloud Functions for Neighborhood Credit System

This document outlines the backend logic for cloud functions related to the Neighborhood Credit System.

## 1. `calculateInitialCreditScore(userId)`

**Purpose:** Calculates and updates a user's `neighborhoodCreditScore` based on their profile completeness.

**Trigger:**
*   Called after a user successfully logs in.
*   Called after a user updates their profile information (specifically, information that contributes to `userProfileDetails`).

**Logic:**

```javascript
// Simulated Cloud Function Environment (e.g., WeChat Cloud Functions, Firebase Functions)

/**
 * Calculates and updates the neighborhoodCreditScore for a user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number>} The updated neighborhoodCreditScore.
 */
async function calculateInitialCreditScore(userId) {
  // Assume db is an initialized database client (e.g., Firestore, WeChat Cloud DB)
  const db = getDatabaseClient();

  let baseScore = 50; // Default base score
  let scoreFromProfile = 0;

  try {
    // 1. Retrieve user data (optional, if needed for other checks in the future)
    // const userRef = db.collection('Users').doc(userId);
    // const userDoc = await userRef.get();
    // if (!userDoc.exists) {
    //   console.error('User not found:', userId);
    //   throw new Error('User not found');
    // }
    // const userData = userDoc.data();

    // 2. Retrieve userProfileDetails
    const profileDetailsRef = db.collection('UserProfileDetails').where('userId', '==', userId).limit(1);
    const profileDetailsSnapshot = await profileDetailsRef.get();

    if (!profileDetailsSnapshot.empty) {
      const profileDetailsData = profileDetailsSnapshot.docs[0].data();

      // Example: Add points based on profileCompletionPercentage
      if (profileDetailsData.profileCompletionPercentage && profileDetailsData.profileCompletionPercentage > 80) {
        scoreFromProfile += 20; // Bonus for high completion
      } else if (profileDetailsData.profileCompletionPercentage && profileDetailsData.profileCompletionPercentage > 50) {
        scoreFromProfile += 10; // Bonus for moderate completion
      }

      // Example: Add points if specific items are set (can be more granular)
      if (profileDetailsData.isBioSet) {
        scoreFromProfile += 5;
      }
      if (profileDetailsData.isInterestsSet) {
        scoreFromProfile += 5;
      }
      // Add more conditions as needed
    } else {
      console.warn('UserProfileDetails not found for user:', userId);
      // If no profile details, they get no bonus points from it.
      // Optionally, create a default UserProfileDetails document here.
    }

    const finalScore = baseScore + scoreFromProfile;

    // 3. Update the neighborhoodCreditScore in the Users table
    await db.collection('Users').doc(userId).update({
      neighborhoodCreditScore: finalScore,
      updatedAt: new Date() // Or use server timestamp
    });

    console.log(`Neighborhood credit score for user ${userId} updated to ${finalScore}`);
    return finalScore;

  } catch (error) {
    console.error('Error calculating initial credit score for user:', userId, error);
    // Depending on the error, you might want to re-throw or handle it
    // For now, return a default/previous score or handle silently
    // Re-throwing will make the calling function aware of the failure.
    throw error;
  }
}

/**
 * Placeholder for getting a database client.
 * In a real environment, this would be initialized according to the cloud provider's SDK.
 */
function getDatabaseClient() {
  // Example:
  // if (process.env.CLOUD_PROVIDER === 'firebase') {
  //   const admin = require('firebase-admin');
  //   if (!admin.apps.length) {
  //     admin.initializeApp();
  //   }
  //   return admin.firestore();
  // } else if (process.env.CLOUD_PROVIDER === 'wechat') {
  //   const cloud = require('wx-server-sdk');
  //   cloud.init();
  //   return cloud.database();
  // }
  // This is a mock for simulation purposes
  return {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => ({ exists: true, data: () => ({ /* mock user data */ }) }),
        update: async (data) => console.log(`Mock DB Update for ${name}/${id}:`, data),
      }),
      where: (field, op, value) => ({
        limit: (num) => ({
          get: async () => ({
            empty: false,
            docs: [{ data: () => ({ userId: value, profileCompletionPercentage: 85, isBioSet: true, isInterestsSet: true }) }]
          })
        })
      }),
    }),
  };
}

// --- How to integrate with User Login and Profile Update ---

// **On User Login (Conceptual)**
// After successful WeChat login and retrieval/creation of user record in `Users` table:
//
// async function handleUserLogin(userId) {
//   // ... other login logic ...
//   try {
//     await calculateInitialCreditScore(userId);
//     console.log('Credit score calculation triggered post-login for user:', userId);
//   } catch (error) {
//     console.error('Failed to update credit score post-login for user:', userId, error);
//   }
//   // ... rest of login flow ...
// }

// **On User Profile Update (Conceptual)**
// When user updates profile sections that affect `UserProfileDetails`:
//
// async function handleUserProfileUpdate(userId, updatedProfileData) {
//   // 1. Update UserProfileDetails (e.g., isBioSet, profileCompletionPercentage)
//   // ... logic to update UserProfileDetails table ...
//
//   // 2. Recalculate credit score
//   try {
//     await calculateInitialCreditScore(userId);
//     console.log('Credit score recalculation triggered post-profile update for user:', userId);
//   } catch (error) {
//     console.error('Failed to update credit score post-profile update for user:', userId, error);
//   }
//   // ... rest of update flow ...
// }

```

**Key Considerations:**

*   **Database Client:** The `getDatabaseClient()` function is a placeholder. In a real WeChat Mini Program, you'd use `wx-server-sdk` to interact with the cloud database.
*   **Error Handling:** Robust error handling is important.
*   **`UserProfileDetails` Creation:** If `UserProfileDetails` might not exist for a user, the function could proactively create a default document.
*   **Atomicity:** For more complex scoring updates, consider using database transactions if your cloud provider supports them, to ensure data consistency.
*   **Extensibility:** The scoring logic (e.g., points for `isBioSet`) is designed to be easily extensible.

This cloud function provides the initial mechanism for calculating the `neighborhoodCreditScore`. The actual calls to this function would be integrated into the user login and profile update flows within the mini program's backend service.

---

## Future Work: Linking Community Activity to Credit Score

Activity in the Community module (e.g., creating posts, receiving positive interactions like upvotes/likes - once implemented, helpful comments) should contribute positively to the `neighborhoodCreditScore`. Conversely, negative actions (e.g., posts being flagged or removed, receiving downvotes - once implemented) could negatively impact the score.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **Positive Contributions:**
    *   Creating a helpful/engaging post in a group: +1 to +3 points (could be based on post length, engagement, or admin approval).
    *   Receiving a "like" or "upvote" on a post/comment: +0.1 points per like (capped per day/post).
    *   Organizing a successful community event through a group: +5 to +10 points.
    *   Successfully moderating a group (if group admin features are added): +2 points per month.
*   **Negative Contributions (Requires a reporting/moderation system):**
    *   Post/comment flagged by multiple users and confirmed by admin as inappropriate: -5 to -10 points.
    *   Being removed from a group due to rule violations: -10 points.
    *   Repeatedly posting spam or low-quality content: -3 to -5 points per incident after warning.

**Implementation Notes:**

*   These adjustments would likely be handled by separate cloud functions triggered by specific events (e.g., `onNewPostCreated`, `onPostLiked`, `onPostFlagged`).
*   The `calculateInitialCreditScore` function could be augmented or a new function `updateCreditScoreForCommunityActivity` could be created to handle these incremental changes.
*   A clear system for users to understand how their score is affected would be important.
*   Careful balancing is needed to prevent gaming the system while encouraging positive community engagement.

---

## Future Work: Linking Group Buy Activity to Credit Score

Group buy activities are significant trust-building (or breaking) events. Successful participation and initiation should positively impact `neighborhoodCreditScore`, while failures or misconduct should lead to penalties. All such events must be logged in the `TrustActivityLog`.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **For Initiators:**
    *   Successfully initiating and completing a group buy (reaches minimum participants, marked as complete, items distributed/service rendered): +5 to +15 points (depending on scale/complexity).
        *   *TrustActivityLog:* `activityType: 'GROUP_BUY_INITIATE_SUCCESS'`, `pointsChange: +X`, `description: "Successfully completed group buy: [GroupBuyTitle]"`
    *   Group buy fails to reach minimum participants (no fault of initiator): 0 points, or a very small +1 for effort if it's a recurring positive pattern.
        *   *TrustActivityLog:* `activityType: 'GROUP_BUY_INITIATE_FAIL_MIN_PARTICIPANTS'`, `pointsChange: 0`, `description: "Group buy '[GroupBuyTitle]' failed to meet minimum participants."`
    *   Cancelling a group buy after participants have joined, due to initiator's fault (e.g., found a better deal elsewhere for themselves, misrepresentation): -10 to -20 points.
        *   *TrustActivityLog:* `activityType: 'GROUP_BUY_INITIATE_CANCEL_FAULT'`, `pointsChange: -X`, `description: "Cancelled group buy '[GroupBuyTitle]' due to initiator fault after N participants joined."`
    *   Receiving positive feedback from participants (if a feedback system is implemented): +1 per positive feedback (capped).

*   **For Participants:**
    *   Successfully joining and completing participation in a group buy (e.g., makes payment if required, collects item): +2 to +5 points.
        *   *TrustActivityLog:* `activityType: 'GROUP_BUY_PARTICIPATE_SUCCESS'`, `pointsChange: +Y`, `description: "Successfully participated in group buy: [GroupBuyTitle]"`
    *   Failing to fulfill commitment after joining (e.g., not paying, not collecting item without valid reason): -5 to -10 points.
        *   *TrustActivityLog:* `activityType: 'GROUP_BUY_PARTICIPATE_FAIL'`, `pointsChange: -Y`, `description: "Failed to fulfill commitment in group buy: [GroupBuyTitle]"`

**Implementation Notes:**

*   Cloud functions would be triggered by changes in the `GroupBuys` and `GroupBuyParticipants` tables (e.g., status updates).
*   For example, when a `GroupBuys` status changes to 'completed', a function would iterate through `GroupBuyParticipants` with 'paid' or 'collected' status and award points to them and the initiator.
*   Penalties require careful validation, possibly involving a dispute resolution or admin confirmation step to avoid unfair penalization.
*   The `relatedId` in `TrustActivityLog` would store the `groupBuyId` or `participationId`.
*   The description in `TrustActivityLog` should be informative enough for users to understand the reason for the score change.

---

## Future Work: Linking Service Exchange Activity to Credit Score

The provision and consumption of services are key interactions within the neighborhood that directly reflect trustworthiness and community contribution. Both providing and requesting services responsibly should positively impact `neighborhoodCreditScore`, while failures, poor service, or abuse of the system should lead to penalties. All significant events must be logged in `TrustActivityLog`.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **For Service Providers (`providerUserId`):**
    *   Successfully completing a requested service (marked as 'completed_by_provider' and then 'confirmed_by_requester'): +3 to +10 points per service (depending on complexity, effort, or if it's a free/volunteer service).
        *   *TrustActivityLog:* `activityType: 'SERVICE_PROVIDED_SUCCESS'`, `pointsChange: +X`, `description: "Successfully provided service: [ServiceTitle] for [RequesterNickname]"`
    *   Receiving positive feedback/rating from the requester (if a rating system is implemented): +1 to +3 points per positive rating.
    *   Cancelling an accepted request without valid reason or frequent cancellations: -5 to -10 points.
        *   *TrustActivityLog:* `activityType: 'SERVICE_PROVIDER_CANCEL_FAULT'`, `pointsChange: -X`, `description: "Cancelled accepted service request: [ServiceTitle] for [RequesterNickname]"`
    *   Receiving a validated complaint about poor service quality or misconduct: -10 to -20 points (requires a dispute/validation mechanism).
        *   *TrustActivityLog:* `activityType: 'SERVICE_POOR_QUALITY_VALIDATED'`, `pointsChange: -X`, `description: "Validated complaint for poor service: [ServiceTitle] for [RequesterNickname]"`

*   **For Service Requesters (`requesterUserId`):**
    *   Requesting a service and confirming its completion promptly: +1 to +3 points.
        *   *TrustActivityLog:* `activityType: 'SERVICE_REQUEST_COMPLETE_CONFIRMED'`, `pointsChange: +Y`, `description: "Requested and confirmed completion of service: [ServiceTitle] by [ProviderNickname]"`
    *   Providing clear requirements and being responsive during service coordination: +1 point (harder to track automatically, might rely on provider feedback).
    *   Cancelling requests frequently or last-minute without valid reason: -3 to -5 points.
        *   *TrustActivityLog:* `activityType: 'SERVICE_REQUESTER_CANCEL_FAULT'`, `pointsChange: -Y`, `description: "Cancelled service request: [ServiceTitle] from [ProviderNickname] without valid reason."`
    *   Making unfair complaints or abusing the dispute system: -10 points.

**Implementation Notes:**

*   Cloud functions would be essential, triggered by status changes in the `ServiceRequests` table.
    *   When a `ServiceRequests` status changes to 'confirmed_by_requester', points are awarded to both provider and requester.
    *   When a request is 'cancelled_by_provider' or 'cancelled_by_requester', logic would determine if it was a "fault" cancellation and apply penalties. This might involve checking how soon before the `agreedDateTime` the cancellation occurred.
*   A feedback/rating system for services would be highly beneficial for more nuanced score adjustments.
*   A dispute resolution mechanism is crucial before applying significant penalties, especially for "poor service quality" or "unfair complaints."
*   The `relatedId` in `TrustActivityLog` would store the `serviceId` or `requestId`.
*   Descriptions in `TrustActivityLog` should clearly state the service and the other party involved for transparency.

---

## Future Work: Linking Endorsements to Credit Score

User endorsements are a direct measure of peer trust. Receiving endorsements should positively influence the `neighborhoodCreditScore`, and giving thoughtful endorsements might also be a small positive factor.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **For Endorsee (`endorseeUserId`):**
    *   Receiving an endorsement: +1 to +3 points per unique endorser for a specific `endorsementType`.
        *   The points could be weighted by the `endorserUserId`'s `neighborhoodCreditScore` (e.g., endorsement from a user with >120 score gives +3, from 100-119 gives +2, from 80-99 gives +1).
        *   A cap might be needed on how many points can be gained from endorsements of a single type or overall.
        *   *TrustActivityLog:* `activityType: 'ENDORSEMENT_RECEIVED'`, `pointsChange: +X`, `description: "Received '[EndorsementType]' endorsement from [EndorserNickname]"`
*   **For Endorser (`endorserUserId`):**
    *   Giving an endorsement: +0.1 to +0.5 points for giving an endorsement, encouraging participation.
        *   This should be capped (e.g., max +2 points per month from giving endorsements) to prevent spamming.
        *   *TrustActivityLog:* `activityType: 'ENDORSEMENT_GIVEN'`, `pointsChange: +Y`, `description: "Gave '[EndorsementType]' endorsement to [EndorseeNickname]"`

**Implementation Notes:**

*   Cloud functions would be triggered when a new entry is added to the `UserEndorsements` table.
*   The function would update the `neighborhoodCreditScore` for both the `endorseeUserId` and potentially the `endorserUserId`.
*   The `relatedId` in `TrustActivityLog` for `ENDORSEMENT_RECEIVED` would be the `endorsementId`.

---

## Future Work: Linking Dispute Resolution to Credit Score

The dispute resolution system is critical for maintaining trust. Outcomes must have a clear impact on the `neighborhoodCreditScore` of the involved parties.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **For Reported User (`reportedUserId`):**
    *   Dispute resolved in favor of the reporter (i.e., reported user found at fault): -5 to -50 points, depending on the severity and type of issue (e.g., non-delivery in a group buy, significantly misrepresented service, harassment).
        *   *TrustActivityLog:* `activityType: 'DISPUTE_RESOLVED_NEGATIVE'`, `pointsChange: -X`, `description: "Dispute ([DisputeId]) regarding '[ItemType]: [RelatedItemTitle/Details]' resolved against user."`
    *   Repeated validated disputes against a user could lead to escalating point deductions or temporary/permanent suspension from specific platform features or the platform itself.

*   **For Reporter (`reporterUserId`):**
    *   Dispute resolved in favor of the reporter (issue validated): +1 to +3 points for helping maintain community standards.
        *   *TrustActivityLog:* `activityType: 'DISPUTE_RESOLVED_POSITIVE'`, `pointsChange: +Y`, `description: "Dispute ([DisputeId]) regarding '[ItemType]: [RelatedItemTitle/Details]' was validated."`
    *   Filing a dispute (initial act, regardless of outcome, if not frivolous): 0 points or a very minor +0.1, as reporting is generally encouraged.
        *   *TrustActivityLog:* `activityType: 'DISPUTE_FILED'`, `pointsChange: 0`, `description: "Filed dispute ([DisputeId]) regarding '[ItemType]: [RelatedItemTitle/Details]'."`
    *   Dispute found to be frivolous, false, or an attempt to abuse the system: -10 to -20 points.
        *   *TrustActivityLog:* `activityType: 'DISPUTE_FRIVOLOUS_REPORT'`, `pointsChange: -X`, `description: "Dispute ([DisputeId]) filed by user found to be frivolous."`

**Implementation Notes:**

*   Cloud functions would be triggered when a `Disputes` table entry changes status (e.g., to 'RESOLVED_FAVOR_REPORTER' or 'RESOLVED_FAVOR_REPORTED').
*   The function would update the `neighborhoodCreditScore` for the relevant user(s).
*   A clear, transparent, and fair dispute resolution process (potentially involving human moderators/admins) is paramount before automated score adjustments are made, especially for penalties.
*   The `relatedId` in `TrustActivityLog` would be the `disputeId`.
*   Descriptions should be clear but might need to be somewhat generic to protect privacy in some cases, while still being informative on the user's private log.

---

## Future Work: Linking Inter-Module Synergies to Credit Score

The UX design concepts for "Community Event to Group Buy" and "Community Discussion to Service Request" can also have implications for the trust system. Engaging in these synergistic flows can be a positive indicator.

**Specific Actions and Potential Point Values (Examples - to be refined):**

*   **Community Event to Group Buy Synergy:**
    *   **Event Organizer linking/initiating a relevant Group Buy for an event:** +1 to +2 points for proactive organization.
        *   *TrustActivityLog:* `activityType: 'EVENT_TO_GROUPBUY_LINK'`, `pointsChange: +X`, `description: "Linked/initiated Group Buy for event: [EventTitle]"`
    *   **Successfully participating in a Group Buy linked to a Community Event:** This would be covered by the general `GROUP_BUY_PARTICIPATE_SUCCESS` but the context (event) might be noted in the description.

*   **Community Discussion to Service Request Synergy:**
    *   **User successfully finding and engaging a service provider through a contextual suggestion from a community post:**
        *   For the **requester**: Points would be awarded upon `SERVICE_REQUEST_COMPLETE_CONFIRMED` as usual. The description in `TrustActivityLog` could note "via community discussion link."
        *   For the **provider**: Points would be awarded upon `SERVICE_PROVIDED_SUCCESS` as usual.
    *   **User manually linking a relevant service in a community discussion (e.g., replying to a help request with a link to a provider):** +0.5 to +1 point for being helpful, if the suggestion is deemed appropriate (might need light moderation or upvotes on the reply).
        *   *TrustActivityLog:* `activityType: 'COMMUNITY_SERVICE_REFERRAL'`, `pointsChange: +X`, `description: "Referred service [ServiceTitle] in community discussion for [PostTopic/Requester]"`

**Implementation Notes:**

*   These would likely be more complex to track automatically and might rely on user actions (like clicking a specific "initiate group buy for this event" button) or, in more advanced cases, some form of Natural Language Processing (NLP) to understand the context of posts and replies.
*   The primary benefit of these synergies is UX improvement; trust score adjustments should be considered secondary and carefully implemented to avoid over-complication or gaming.
*   Logging these synergistic actions in `TrustActivityLog` (even with 0 points initially) can provide valuable data on how users interact with the platform's integrated features.

---

## Trust Algorithm Iteration & Refinements

The `neighborhoodCreditScore` is a dynamic value intended to reflect a user's trustworthiness and positive contributions within the community. The initial calculation focuses on profile completeness, but its true value comes from ongoing activities. This section details proposed refinements to the algorithm.

The core idea is to move from a simple `calculateInitialCreditScore` to a more robust `updateUserTrustScore(userId, activityType, relatedData)` function that is called whenever a relevant event occurs. This function would fetch the current score and apply an adjustment based on the `activityType`.

### 1. Base Score and Initial Setup

*   **New User Base Score:** 75 points (changed from 50). This provides a slightly more neutral starting point.
*   **Profile Completion Bonus:**
    *   Setting avatar: +5 points
    *   Setting nickname (if different from default): +3 points
    *   Setting bio: +7 points (up to 15 points for basic profile, was 10+ based on `isBioSet` and `isInterestsSet` which were 5 each. `profileCompletionPercentage` is too vague for initial setup).
    *   *TrustActivityLog:* `PROFILE_SETUP_COMPLETE`, points: sum of above, description: "Initial profile setup bonuses applied."
*   **Rationale:** Higher base score feels less punitive initially. Clearer points for specific initial actions.

### 2. Weighting of Activities & Point Ranges

Different activities carry different weights in reflecting trust. Below are proposed point ranges. These are illustrative and would need tuning based on observation.

*   **High Impact Positive (e.g., +10 to +25 points):**
    *   `GROUP_BUY_INITIATE_SUCCESS`: Successfully leading a significant group buy (e.g., >10 participants or high value).
    *   `SERVICE_PROVIDED_SUCCESS` (for complex/high-value service with positive feedback).
    *   `EVENT_ORGANIZED_SUCCESS`: Organizing a well-attended and positively received community event. (New `TrustActivityLog` type)
    *   `DISPUTE_RESOLVED_POSITIVE` (as a reporter of a significant issue that improved community safety/fairness).
*   **Medium Impact Positive (e.g., +3 to +10 points):**
    *   `GROUP_BUY_PARTICIPATE_SUCCESS`: Reliable participation in group buys.
    *   `SERVICE_PROVIDED_SUCCESS` (for standard services).
    *   `SERVICE_REQUEST_COMPLETE_CONFIRMED`: Being a responsible service requester.
    *   `ENDORSEMENT_RECEIVED` (from a high-trust user, per unique endorser/type).
    *   `COMMUNITY_HELPFUL_POST_HIGH_ENGAGEMENT`: Creating a community post that receives significant positive engagement (e.g., many likes, helpful comments - requires more complex tracking). (New `TrustActivityLog` type)
    *   `EVENT_TO_GROUPBUY_LINK`: Proactive organization.
*   **Low Impact Positive (e.g., +0.5 to +2 points):**
    *   `PROFILE_UPDATE` (e.g., adding interests after initial setup, minor updates).
    *   `COMMUNITY_POST` (general participation, basic post).
    *   `ENDORSEMENT_GIVEN` (capped).
    *   `COMMUNITY_SERVICE_REFERRAL`.
    *   Receiving a simple "like" on a post/comment (capped daily).

*   **High Impact Negative (e.g., -15 to -50 points):**
    *   `DISPUTE_RESOLVED_NEGATIVE` (found at fault for a serious issue like fraud, harassment, significant misrepresentation).
    *   `GROUP_BUY_INITIATE_CANCEL_FAULT` (for large/impactful group buys).
    *   Repeated `SERVICE_POOR_QUALITY_VALIDATED` or `GROUP_BUY_PARTICIPATE_FAIL`.
*   **Medium Impact Negative (e.g., -5 to -15 points):**
    *   `GROUP_BUY_PARTICIPATE_FAIL` (first instance).
    *   `SERVICE_PROVIDER_CANCEL_FAULT` (first instance).
    *   `SERVICE_POOR_QUALITY_VALIDATED` (first instance).
    *   `COMMUNITY_CONTENT_NEGATIVE` (e.g., confirmed spam, offensive content, removal from group for cause).
    *   `DISPUTE_FRIVOLOUS_REPORT`.
*   **Low Impact Negative (e.g., -1 to -5 points):**
    *   Minor infractions, initial warnings.
    *   `SERVICE_REQUESTER_CANCEL_FAULT` (if last minute but not a pattern).
*   **Rationale:** Creates a clearer hierarchy of actions and their consequences, making the score more meaningful.

### 3. Score Decay / Time Factor

The relevance of past actions should diminish over time.

*   **Concept:**
    *   **Full Impact Period:** Points from an activity have full impact for a defined period (e.g., 6 months).
    *   **Gradual Decay:** After this period, the points contributed by that specific activity gradually decrease over the next period (e.g., lose 10% of their value each month for 10 months, or a half-life decay model).
    *   **Minimum Relevance:** Very old activities (e.g., > 1.5-2 years) might contribute only a very small fraction or zero to the current score, though the log remains for historical reference.
    *   **Severity Exception:** Very severe negative actions (e.g., fraud resulting in -50 points) might have a much longer full impact period or a slower decay rate.
*   **Implementation Sketch:**
    *   Each entry in `TrustActivityLog` contributes to the current score.
    *   A nightly or weekly batch job (`recalculateAllUserScores`) could iterate through all users. For each user, it would sum points from their `TrustActivityLog`, applying the decay function to each `pointsChange` based on its `timestamp` and `activityType` (for severity exception).
    *   Alternatively, the decay could be applied dynamically when the score is requested, but this might be computationally intensive if a user has many log entries. A hybrid approach where the score is recalculated and cached periodically might be best.
*   **Rationale:** Ensures the score reflects recent and relevant behavior more strongly, allowing for redemption and preventing users from being permanently penalized for old minor mistakes.

### 4. Score Thresholds & Tiers

Define qualitative tiers based on score ranges. These tiers can unlock certain platform privileges or recognition.

*   **Proposed Tiers & Score Ranges (Illustrative):**
    *   **< 60: Needs Improvement / Restricted** (Red Icon/Indicator)
        *   Potential restrictions: Cannot initiate group buys/offer services, posts may require moderation, reduced visibility.
    *   **60-79: Building Trust** (Yellow Icon/Indicator)
        *   Basic access. Encouraged to participate positively.
    *   **80-99: Neighbor** (Default/Neutral Icon/Indicator - Current Base)
        *   Full access to standard features.
    *   **100-119: Active & Reliable Member** (Green Icon/Indicator)
        *   May get slight priority in listings (e.g., sort order tie-breaker).
        *   Small visual badge of recognition.
    *   **120-149: Trusted Neighbor** (Blue Icon/Indicator with Sparkle)
        *   Higher priority in listings.
        *   Access to beta test new features.
        *   May be eligible to mediate minor disputes (if such a system is built).
        *   Featured in "Trust Champions" (Home Page placeholder).
    *   **150+: Community Pillar** (Purple Icon/Indicator with Crown)
        *   Highest visibility and recognition.
        *   Potential advisory role in community feedback sessions.
        *   Can endorse with slightly higher weight.
*   **Benefits/Permissions:**
    *   Increased visibility for positive actions (e.g., group buys by high-trust users are highlighted).
    *   Access to certain platform features (e.g., only "Trusted Neighbors" can initiate very large group buys).
    *   Community recognition (e.g., "Community Pillar" badge).
    *   Reduced restrictions (e.g., less moderation for posts from high-tier users).
*   **Rationale:** Provides clear milestones for users and tangible (though mostly social) benefits for maintaining a high trust score, encouraging positive behavior.

### 5. Preventing Gamification

Discouraging users from artificially inflating scores is crucial.

*   **Rate Limiting:** Limit how many points can be earned from repeatable low-impact actions within a certain timeframe (e.g., max +2 points per day from "liking" posts, max +1 point per month from "giving endorsements" to the same person for the same type).
*   **Caps on Point Categories:** Maximum points achievable from certain categories like "profile completion" or "giving endorsements."
*   **Review for Unusual Activity:** Automated flags for patterns like mass-endorsing by new accounts, or unusually high rates of specific point-generating activities. These could trigger manual review.
*   **Diminishing Returns:** Some actions might yield fewer points if repeated excessively.
*   **Focus on High-Value Interactions:** Weighting the algorithm towards actions that genuinely require trust and benefit the community (e.g., successful group buys, reliable service provision) rather than trivial actions.
*   **Community Moderation/Reporting:** Allow users to flag suspicious endorsements or activities if they seem disingenuous.
*   **Rationale:** Maintains the integrity of the trust score.

### 6. Negative Actions & Specific Deductions

Further detail on negative actions:

*   **No-Show/Cancellation:**
    *   `GROUP_BUY_PARTICIPANT_NO_PAY`: -10 points if fails to pay after commitment.
    *   `SERVICE_REQUESTER_NO_SHOW`: -10 points if requester doesn't show for an agreed service.
    *   `SERVICE_PROVIDER_NO_SHOW`: -15 points if provider doesn't show.
*   **Misrepresentation:**
    *   `ITEM_NOT_AS_DESCRIBED` (validated dispute outcome for group buy/service): -10 to -25 points for provider/initiator.
*   **Harassment/Abuse:**
    *   `COMMUNITY_HARASSMENT_VALIDATED` (validated dispute/report): -25 to -50 points, potential platform ban.
*   **Spamming:**
    *   `COMMUNITY_SPAM_POSTING` (repeated after warning): -5 points per validated incident.
*   **Rationale:** Clear consequences for actions that damage trust.

### 7. Redemption & Score Improvement

Users must have clear paths to improve their score.

*   **Positive Contributions:** Consistent positive actions (as defined in weighting) are the primary way to improve.
*   **Time Decay:** As older negative incidents decay in point value, the score naturally improves if no new negative incidents occur.
*   **Specific Redemption Tasks (Conceptual - Advanced):**
    *   For very low scores, the platform might suggest specific, verifiable positive actions (e.g., "Volunteer for a community event and get it verified by the organizer," "Successfully complete X small services/group buy participations without issue"). This is complex and requires careful design.
*   **Transparency:** Users should be able to see a (simplified) log of what impacted their score (from `TrustActivityLog`) to understand how to improve.
*   **Rationale:** Provides hope and clear direction for users who wish to rebuild their trust within the community.

## Process for Future Iteration of the Trust Algorithm

The trust algorithm should be a living system, adaptable to community feedback and observed behaviors.

1.  **Designated Review Team/Owner:** A small team or a dedicated product manager should be responsible for overseeing the trust system.
2.  **Regular Review Cadence:** Schedule periodic reviews (e.g., quarterly or bi-annually) of the algorithm's effectiveness, fairness, and impact.
3.  **Data Collection & Monitoring:**
    *   **User Feedback:** Systematically collect feedback on the trust system through surveys (as per `user_testing_plan.md`), feedback forums, and direct user support channels.
    *   **Behavioral Data:** Analyze trends from `TrustActivityLog` – Are certain actions being gamed? Are penalties too harsh or too lenient for specific activities? What is the overall score distribution?
    *   **Dispute Data:** Analyze types and outcomes of disputes.
    *   **Community Manager Input:** Gather insights from community managers (if applicable) on how the score reflects real-world trustworthiness.
4.  **Hypothesis-Driven Adjustments:**
    *   When proposing changes, form a clear hypothesis (e.g., "Increasing points for successful large group buys will encourage more trusted members to initiate them").
    *   Model potential impacts before broad implementation.
5.  **A/B Testing (If Feasible):** For significant changes, consider A/B testing different algorithm parameters in isolated segments of the user base (technically complex for a mini-program but conceptually ideal).
6.  **Phased Rollout of Changes:** Introduce significant changes incrementally and monitor their impact closely.
7.  **Clear Communication:** Communicate any major changes to the trust algorithm transparently to the user base, explaining the rationale.
8.  **Ethical Review:** Ensure all changes are reviewed for fairness, potential biases, and alignment with community values.

By establishing this iterative process, the `neighborhoodCreditScore` can evolve to become an increasingly accurate and fair reflection of trust within the community, adapting to new platform features and user behaviors over time.
