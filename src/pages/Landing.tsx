import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { useOnboarding } from "@/hooks/useOnboarding";
import { motion } from "motion/react";
import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-columns-1";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    image: "/image1.png",
    title: "AI-Powered Recognition",
    description:
      "Simply snap a photo and let our AI identify your food and calculate calories instantly",
  },
  {
    image: "/image2.png",
    title: "Personalized Plans",
    description:
      "Get custom meal plans tailored to your goals, lifestyle, and dietary preferences",
  },
  {
    image: "/image3.png",
    title: "Real-time Tracking",
    description:
      "Track calories, macros, and nutrition throughout the day with live updates",
  },
  {
    image: "/image4.png",
    title: "Stay Motivated",
    description:
      "Visual progress tracking and health scores keep you engaged and accountable",
  },
];

const testimonials: Testimonial[] = [
  {
    text: "I lost 15 lbs in 2 months! I was about to go on Ozempic but decided to give this app a shot and it worked!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Marley Brylle",
    role: "Verified User",
  },
  {
    text: "The AI food recognition is incredible! It saves me so much time and makes tracking actually enjoyable.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Benny Marcos",
    role: "Verified User",
  },
  {
    text: "As a busy mom of three, the personalized meal plans work for my whole family. Down 20 lbs and not deprived!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Sarah Chen",
    role: "Verified User",
  },
  {
    text: "Snapping a photo instead of logging everything by hand changed the game. I actually stick with it now.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "Verified User",
  },
  {
    text: "The streaks and badges keep me motivated every single day. Best habit tracker I've used.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Verified User",
  },
  {
    text: "The macro breakdowns and analytics are so clear. I finally understand what I'm eating.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Verified User",
  },
  {
    text: "Accurate calorie estimates and a beautiful dashboard. Hit my goal weight in 4 months.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Verified User",
  },
  {
    text: "Barcode scanning for packaged food is a huge time-saver. Tracking takes seconds now.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Verified User",
  },
  {
    text: "I've tried 5 other apps and this is by far the best. The health score keeps me accountable.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Verified User",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Landing = () => {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { isOnboardingComplete } = useOnboarding();

  // New users -> onboarding. Returning (already onboarded) users -> dashboard.
  const handleGetStarted = () => {
    if (!isSignedIn) navigate("/signup");
    else if (isOnboardingComplete) navigate("/dashboard");
    else navigate("/onboarding/gender");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold">Cal AI</div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-foreground hover:text-accent transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-foreground hover:text-accent transition-colors">
              Reviews
            </a>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              <FontAwesomeIcon icon={resolvedTheme === "dark" ? faSun : faMoon} className="h-5 w-5" />
            </Button>
            <SignedOut>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Button onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-6 pb-16 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
                Transform Your Health with AI-Powered Nutrition Tracking
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                CalorieAI creates personalized meal plans and tracks your calories effortlessly
              </p>
              <Button
                size="lg"
                className="h-14 rounded-xl px-8 text-lg font-semibold"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 p-8">
                <div className="flex h-full items-center justify-center">
                  <img
                    src="/hero-image.webp"
                    alt="AI-Powered Food Recognition"
                    className="h-full w-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="overflow-hidden border-none bg-background p-0 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-accent to-accent/80 p-12 text-center text-background">
            <h2 className="mb-4 text-4xl font-bold">
              80% of CalorieAI users maintain their weight loss even 6 months later
            </h2>
            <p className="mb-8 text-xl opacity-90">1000+ CalorieAI people trust us</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon key={star} icon={faStar} className="h-6 w-6" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted px-6 py-20">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg">Testimonials</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              What our users say
            </h2>
            <p className="text-center mt-5 opacity-75">
              See what our customers have to say about us.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to start your journey?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of people achieving their health goals with CalorieAI
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
              onClick={handleGetStarted}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Landing = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // const handleNavigation = (path) => {
//   //   console.log(`Navigate to: ${path}`);
//   //   // In your actual app, use your router navigation here
//   // };

//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Navigation */}
//       <nav className="border-b border-border px-6 py-4">
//         <div className="mx-auto flex max-w-7xl items-center justify-between">
//           <div className="text-2xl font-bold">Cal AI</div>
//           <div className="hidden items-center gap-8 md:flex">
//             <a href="#features" className="text-foreground hover:text-primary transition-colors">
//               Features
//             </a>
//             <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
//               How It Works
//             </a>
//             <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
//               Reviews
//             </a>
//             <Button variant="outline" onClick={() => navigate("/login")}>
//               Login
//             </Button>
//             <Button onClick={() => navigate("/signup")}>
//               Sign Up
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="px-6 py-20 md:py-32">
//         <div className="mx-auto max-w-7xl">
//           <div className="grid items-center gap-12 md:grid-cols-2">
//             <div>
//               <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
//                 🎉 Over 10,000 Success Stories
//               </div>
//               <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
//                 Transform Your Health with AI-Powered Nutrition Tracking
//               </h1>
//               <p className="mb-6 text-xl text-muted-foreground">
//                 CalorieAI creates personalized meal plans and tracks your calories effortlessly.
//                 No more guessing, no more tedious manual logging—just snap, track, and achieve your goals.
//               </p>
//               <div className="mb-8 flex flex-wrap gap-4">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//                     <span className="text-xl">✓</span>
//                   </div>
//                   <span className="text-sm font-medium">7-day free trial</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//                     <span className="text-xl">✓</span>
//                   </div>
//                   <span className="text-sm font-medium">No credit card required</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//                     <span className="text-xl">✓</span>
//                   </div>
//                   <span className="text-sm font-medium">Cancel anytime</span>
//                 </div>
//               </div>
//               <Button
//                 size="lg"
//                 className="h-14 rounded-xl px-8 text-lg font-semibold"
//                 onClick={() => navigate("/signup")}
//               >
//                 Start Free Trial →
//               </Button>
//             </div>
//             <div className="relative">
//               <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-3xl"></div>
//               <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
//               <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-xl">
//                 <div className="flex h-full flex-col items-center justify-center gap-6">
//                   <div className="text-8xl">📱</div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold">AI-Powered</p>
//                     <p className="text-lg text-muted-foreground">Food Recognition</p>
//                   </div>
//                   <div className="mt-4 flex gap-2">
//                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
//                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.15s' }}></div>
//                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.3s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="bg-muted px-6 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold">
//               Everything You Need to Succeed
//             </h2>
//             <p className="text-xl text-muted-foreground">
//               Powerful features designed to make healthy eating effortless
//             </p>
//           </div>
//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//             <Card className="group border-none bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                 <span className="text-2xl">🧠</span>
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">AI-Powered Recognition</h3>
//               <p className="text-muted-foreground">
//                 Simply snap a photo and let our AI identify your food and calculate calories instantly.
//                 Recognizes over 1 million food items with 95% accuracy.
//               </p>
//             </Card>

//             <Card className="group border-none bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                 <span className="text-2xl">🍽️</span>
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Personalized Plans</h3>
//               <p className="text-muted-foreground">
//                 Get custom meal plans tailored to your goals, lifestyle, and dietary preferences.
//                 Whether you're vegan, keto, or have allergies—we've got you covered.
//               </p>
//             </Card>

//             <Card className="group border-none bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                 <span className="text-2xl">📊</span>
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Real-time Tracking</h3>
//               <p className="text-muted-foreground">
//                 Track calories, macros, and nutrition throughout the day with live updates.
//                 See your progress in beautiful charts and get insights instantly.
//               </p>
//             </Card>

//             <Card className="group border-none bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                 <span className="text-2xl">🔥</span>
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Stay Motivated</h3>
//               <p className="text-muted-foreground">
//                 Visual progress tracking and health scores keep you engaged and accountable.
//                 Celebrate milestones and build lasting healthy habits.
//               </p>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="px-6 py-20">
//         <div className="mx-auto max-w-5xl">
//           <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center text-primary-foreground shadow-2xl">
//             <h2 className="mb-4 text-4xl font-bold">
//               80% of CalorieAI users maintain their weight loss even 6 months later
//             </h2>
//             <p className="mb-8 text-xl opacity-90">Join 10,000+ people who trust CalorieAI</p>
//             <div className="mb-8 flex justify-center gap-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star} className="text-2xl">⭐</span>
//               ))}
//             </div>
//             <div className="mt-8 grid gap-8 md:grid-cols-3">
//               <div className="rounded-xl bg-background/10 p-6 backdrop-blur">
//                 <div className="mb-2 text-4xl font-bold">10K+</div>
//                 <div className="text-sm opacity-90">Active Users</div>
//               </div>
//               <div className="rounded-xl bg-background/10 p-6 backdrop-blur">
//                 <div className="mb-2 text-4xl font-bold">2M+</div>
//                 <div className="text-sm opacity-90">Meals Tracked</div>
//               </div>
//               <div className="rounded-xl bg-background/10 p-6 backdrop-blur">
//                 <div className="mb-2 text-4xl font-bold">4.9★</div>
//                 <div className="text-sm opacity-90">Average Rating</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section id="how-it-works" className="bg-muted px-6 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
//             <p className="text-xl text-muted-foreground">
//               Get started in 3 simple steps
//             </p>
//           </div>
//           <div className="grid gap-8 md:grid-cols-3">
//             <div className="text-center">
//               <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
//                 1
//               </div>
//               <h3 className="mb-3 text-2xl font-semibold">Set Your Goals</h3>
//               <p className="text-muted-foreground">
//                 Tell us about your current weight, target weight, and dietary preferences.
//                 Our AI will create a personalized plan just for you.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
//                 2
//               </div>
//               <h3 className="mb-3 text-2xl font-semibold">Snap & Track</h3>
//               <p className="text-muted-foreground">
//                 Take a photo of your meal and let our AI instantly identify the food and calculate
//                 calories. No manual entry needed!
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
//                 3
//               </div>
//               <h3 className="mb-3 text-2xl font-semibold">Watch Progress</h3>
//               <p className="text-muted-foreground">
//                 Monitor your progress with beautiful charts and insights. Celebrate milestones
//                 and adjust your plan as needed.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="px-6 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-4xl font-bold">What Our Users Say</h2>
//             <p className="text-xl text-muted-foreground">
//               Real results from real people
//             </p>
//           </div>
//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <Card className="border-none bg-background p-8 shadow-sm">
//               <div className="mb-4 flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span key={star} className="text-xl text-primary">⭐</span>
//                 ))}
//               </div>
//               <p className="mb-6 text-lg">
//                 "I lost 15 lbs in 2 months! I was about to go on Ozempic but decided to give this
//                 app a shot and it worked! The meal plans are actually delicious and easy to follow."
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold">
//                   MB
//                 </div>
//                 <div>
//                   <p className="font-semibold">Marley Brylle</p>
//                   <p className="text-sm text-muted-foreground">Lost 15 lbs • 2 months</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="border-none bg-background p-8 shadow-sm">
//               <div className="mb-4 flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span key={star} className="text-xl text-primary">⭐</span>
//                 ))}
//               </div>
//               <p className="mb-6 text-lg">
//                 "The AI food recognition is incredible! It saves me so much time and makes tracking
//                 actually enjoyable. I've tried 5 other apps and this is by far the best."
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold">
//                   BM
//                 </div>
//                 <div>
//                   <p className="font-semibold">Benny Marcos</p>
//                   <p className="text-sm text-muted-foreground">Active for 6 months</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="border-none bg-background p-8 shadow-sm">
//               <div className="mb-4 flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span key={star} className="text-xl text-primary">⭐</span>
//                 ))}
//               </div>
//               <p className="mb-6 text-lg">
//                 "As a busy mom of three, this app has been a lifesaver. The personalized meal plans
//                 work for my whole family, and I've lost 20 lbs without feeling deprived!"
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold">
//                   SC
//                 </div>
//                 <div>
//                   <p className="font-semibold">Sarah Chen</p>
//                   <p className="text-sm text-muted-foreground">Lost 20 lbs • 4 months</p>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-muted px-6 py-20">
//         <div className="mx-auto max-w-4xl">
//           <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 text-center shadow-xl">
//             <h2 className="mb-4 text-4xl font-bold">Ready to start your journey?</h2>
//             <p className="mb-8 text-xl text-muted-foreground">
//               Join 10,000+ people achieving their health goals with CalorieAI.
//               Start your 7-day free trial today—no credit card required.
//             </p>
//             <div className="mb-8 flex flex-wrap justify-center gap-6">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                   <span className="text-xl">✓</span>
//                 </div>
//                 <span className="font-medium">7-day free trial</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                   <span className="text-xl">✓</span>
//                 </div>
//                 <span className="font-medium">No credit card</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                   <span className="text-xl">✓</span>
//                 </div>
//                 <span className="font-medium">Cancel anytime</span>
//               </div>
//             </div>
//             <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//               <Button
//                 size="lg"
//                 className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
//                 onClick={() => navigate("/signup")}
//               >
//                 Start Free Trial →
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </Button>
//             </div>
//             <p className="mt-6 text-sm text-muted-foreground">
//               Already have an account? Just login to continue your journey.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border px-6 py-12">
//         <div className="mx-auto max-w-7xl">
//           <div className="grid gap-8 md:grid-cols-4">
//             <div>
//               <div className="mb-4 text-2xl font-bold">Cal AI</div>
//               <p className="text-sm text-muted-foreground">
//                 Transform your health with AI-powered nutrition tracking.
//               </p>
//             </div>
//             <div>
//               <h4 className="mb-4 font-semibold">Product</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
//                 <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
//                 <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="mb-4 font-semibold">Company</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="mb-4 font-semibold">Legal</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
//                 <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
//             <p>© 2025 CalorieAI. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;