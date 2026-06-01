/**
 * Sample raw-feedback datasets for the clustering + RICE pipeline.
 *
 * Each export is a plain `string[]` of messy, first-person feedback — the kind
 * you'd scrape from app-store reviews and support tickets. Each dataset is
 * seeded with 4–6 distinct underlying themes (repeated in different words by
 * different "users") so the clustering step has real structure to recover.
 */

/**
 * B2B SaaS analytics/collaboration product.
 * Themes: onboarding friction · missing SSO/integrations · billing confusion ·
 * slow support · large-export performance.
 */
export const saasOnboarding: string[] = [
  "Spent my whole first afternoon just trying to figure out how to invite my team. The setup wizard skips right past it and there's no obvious 'add users' button anywhere.",
  "Honestly the onboarding is a maze. I clicked through 6 screens and still had no idea what to do next. Some kind of checklist or sample project would help a lot.",
  "We can't roll this out company-wide until you support SAML SSO. Our security team flat out won't approve another tool with separate passwords.",
  "Does this integrate with Okta? Couldn't find anything in the docs and support hasn't gotten back to me in 4 days.",
  "Exporting anything bigger than ~40k rows just spins forever and then fails. I need to pull our full quarter and it's basically impossible.",
  "The CSV export silently cut off my report at what looked like 50k rows. Didn't notice until my numbers were way off in the board deck. Not great.",
  "Billing is so confusing. I was on the 'Team' plan, got charged for 'Business', and nobody can tell me why the seat count jumped.",
  "Why am I being charged per seat for people who only ever view dashboards? Read-only users shouldn't cost a full license imo.",
  "Opened a ticket on Monday, it's now Thursday and all I've gotten is the automated 'we received your request' email. Come on.",
  "Support is painfully slow. Great product when it works but when something breaks you're basically on your own for days.",
  "The initial setup assumes you already know what a 'workspace' vs a 'project' is. I'm an admin and I genuinely could not tell the difference for the first week.",
  "Pulling large exports times out constantly. If I filter down to a tiny date range it works, but the whole point is I need the big export.",
  "Would be amazing if you connected to Salesforce. Right now I'm copy-pasting between the two tools every single morning.",
  "Got through signup fine but then hit a wall — no template, no demo data, just an empty dashboard staring at me. Where do I even start?",
  "We almost churned over the SSO thing. Please prioritize it, half our procurement holdups are because there's no enterprise login.",
  "Invoice says one thing, the dashboard says another, and the seat math doesn't add up. I just want a clear breakdown of what I'm paying for.",
  "Took us three calls with your sales team to even get a sandbox set up. The self-serve onboarding clearly isn't built for bigger orgs yet.",
  "Export performance is the dealbreaker for my analysts. They live in CSVs and waiting 10 minutes for a download that then errors out is brutal.",
];

/**
 * Consumer mobile app (think habit/fitness tracker with a social feed).
 * Themes: crashes after the latest update · battery drain · intrusive ads ·
 * login/sync problems · disliked redesign · notification spam.
 */
export const mobileApp: string[] = [
  "Ever since the last update the app crashes the second I open the activity tab. Force quit, reinstall, nothing fixes it. Please test before shipping!!",
  "Update broke everything. It worked perfectly last week and now it freezes on the loading screen for like 30 seconds before crashing.",
  "This app DESTROYS my battery. Went from 80% to 20% in two hours with it just running in the background. Something is seriously wrong.",
  "Why is this thing eating 35% of my battery according to settings? I barely even use it. Uninstalled until that's fixed.",
  "So many ads now. A full-screen video ad EVERY time I log a workout? It's unusable. I'd honestly pay to make them stop.",
  "Loved this app for years but the ads got out of control after the redesign. One after another, can't even close them half the time.",
  "Keeps logging me out randomly and then my data won't sync across my phone and tablet. Lost a whole week of streaks because of it.",
  "Sync is broken. My steps show up on my watch but never make it into the app. What's the point of tracking if it doesn't save??",
  "Who approved this new design?? Everything I used to tap once is now buried in a menu. Change it back please.",
  "The new layout is so cluttered. The old one was clean and simple, now there's stuff everywhere and I can't find the start button.",
  "I get like 6 notifications a day nagging me to 'keep my streak'. I turned them off in settings and they came RIGHT back after the update.",
  "Stop sending me push notifications at 7am on a Sunday. There's no way to actually mute the motivational ones, only the 'important' toggle.",
  "App randomly crashes mid-workout and loses everything I logged. Happened three times this week. Getting close to switching apps.",
  "Battery drain is real, my phone gets noticeably warm when the app is open. Never did that before the summer update.",
  "Used to be my favorite app, 5 stars. Now it's ads, crashes, and a confusing new UI. Dropping to 2 until it's sorted.",
  "Login is a nightmare. It won't accept my Google sign-in anymore, just spins and says 'try again later'. Been like this for days.",
  "The redesign hid the one feature I actually used (the weekly summary) like four taps deep. Why.",
  "Notifications won't stop even after I disabled them. I had to mute the whole app at the OS level just to get peace.",
  "Crashes constantly on my older phone since the update. I get it's old but it ran totally fine a month ago.",
];

/**
 * Online store (apparel + general goods).
 * Themes: slow/unreliable shipping · items not as described / sizing · painful
 * returns & refunds · checkout/payment failures · unresponsive customer service.
 */
export const ecommerce: string[] = [
  "Ordered two weeks ago and the tracking hasn't moved off 'label created' for 9 days. Is my order even real at this point?",
  "Paid extra for express shipping and it still took 8 days. Asked for the shipping cost back and got radio silence.",
  "The dress looked nothing like the photos. The color was way more orange in person and the fabric feels cheap. Disappointed.",
  "Sizing is all over the place. Ordered my usual medium and it fit like a kid's shirt. Order a size up, maybe two.",
  "Returns process is a joke. You have to email for an RMA number, wait 3 days for a reply, then pay return shipping yourself. Never again.",
  "Sent something back almost a month ago and STILL no refund. The tracking shows you received it. Where's my money?",
  "Checkout kept failing on my credit card with no error message. Tried three times, got charged twice, order never went through. Now I'm fighting for a refund on charges for an order I don't even have.",
  "Tried to pay with PayPal and the button just does nothing. Had to give up and buy from somewhere else.",
  "Customer service is impossible to reach. No phone number, the chat bot is useless, and emails take a week if they answer at all.",
  "Item arrived damaged and I've emailed support three times with photos. Zero response. Feeling pretty ignored as a customer.",
  "Shipping took forever and when it finally came, it was the wrong color. Now I have to deal with your returns nightmare to fix YOUR mistake.",
  "The product description said '100% cotton' but the tag says polyester blend. Not what I paid for.",
  "Love the stuff when it actually arrives, but delivery is so unpredictable. One order came in 3 days, the next took 3 weeks, same address.",
  "I just want to return one item and the website won't generate a label. It keeps saying 'order not eligible' even though it's well within 30 days.",
  "Got charged but never received an order confirmation email. Had to dig through my bank statement to even confirm it went through.",
  "The shoes run super narrow and there's no size guide on the page. Would've been nice to know before dropping $90.",
  "Refund finally came through after I disputed it with my bank. Shouldn't have to escalate to my credit card company to get my money back.",
  "Quality is hit or miss. The jacket was great, the same brand's pants fell apart after two washes. Inconsistent.",
  "Whole checkout froze at the payment step and wiped my cart when I refreshed. Lost the sale price I'd been waiting for. So frustrating.",
];
