/* NoodleBomb Rewards — verified program constants (single source of truth).
 *
 * Every rewards surface on the site (the /rewards landing page, the homepage
 * "Join Rewards" band, and the "Earn X points" labels on product pages) reads
 * its numbers from THIS file, so the marketing can never drift from what the
 * Smile.io program actually awards.
 *
 * SOURCE — pulled 2026-05-30 (Pacific) from NoodleBomb's LIVE Smile program,
 * publishable key pub_2d27941cfeaca289, using the same endpoints the Smile UI
 * launcher itself calls (header X-Smile-Publishable-Key: pub_2d27941cfeaca289):
 *   GET https://platform.smile.io/smile_ui/init
 *   GET https://platform.smile.io/smile_ui/customer_activity_rules   (ways to earn)
 *   GET https://platform.smile.io/smile_ui/points_products           (ways to redeem)
 *
 * ONLY values actually enabled in the live program are listed here.
 *   Enabled : Points program + Referrals program.
 *   NOT enabled (and therefore NOT advertised anywhere on the site):
 *             VIP / tiers, product reviews, Instagram follow, free-shipping
 *             reward, points expiry.
 *
 * If the merchant changes the program in Smile, re-pull from those endpoints
 * and update THIS file — nothing else.
 */
(function () {
  var NB_REWARDS = {
    publishableKey: 'pub_2d27941cfeaca289',
    programName: 'NoodleBomb Rewards',
    pointsSingular: 'point',
    pointsPlural: 'points',

    // "Place an order" earn rule — verified: "5 Points for every $1 spent"
    // (activity type shopify_online_order, step $1, multiplier 5).
    earnRate: 5,          // points awarded per whole dollar spent
    earnStepDollars: 1,

    // Ways to earn — all four rules below are is_enabled:true in the live program.
    earn: {
      signup:   { points: 250, label: 'Create an account' },
      order:    { rate: 5, label: 'Place an order', detail: '5 points for every $1 spent' },
      facebook: { points: 100, label: 'Share on Facebook' },
      birthday: { points: 250, label: 'Celebrate your birthday' }
    },

    // Ways to redeem — single variable reward: "100 Points = $1", minimum 100.
    redeem: { pointsPerDollar: 100, minPoints: 100, rewardName: 'Order discount' },

    // Referrals program — give $5, get $5 (friend's reward needs a $20+ order).
    referral: { friendReward: 5, advocateReward: 5, friendMinOrder: 20 },

    // Points expiry is not enabled, so points do not expire.
    pointsExpire: false,

    // Points earned on a given dollar price, matching Smile's "X points for
    // every $1 spent" (whole-dollar steps, rounded down — never overstates).
    pointsForPrice: function (price) {
      var p = typeof price === 'number'
        ? price
        : parseFloat(String(price == null ? '' : price).replace(/[^0-9.]/g, ''));
      if (!isFinite(p) || p <= 0) return 0;
      return Math.floor(p / this.earnStepDollars) * this.earnRate;
    }
  };

  window.NB_REWARDS = NB_REWARDS;
})();
