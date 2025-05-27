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
