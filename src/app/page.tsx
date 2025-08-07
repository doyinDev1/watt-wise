"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import UnicornStudioBackground from "@/components/UnicornStudioBackground"
import AnimatedHeadline from "@/components/AnimatedHeadline"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

// Testimonial data
const testimonials = [
  {
    name: "Adebayo Oke",
    company: "Ikeja GRA Properties",
    quote: "WattWise helped me understand exactly what solar system I needed. Saved me thousands!",
    avatar: "AO"
  },
  {
    name: "Chioma Eze",
    company: "Eze Enterprises",
    quote: "Finally, a platform that speaks my language. My business is now powered by the sun!",
    avatar: "CE"
  },
  {
    name: "Kemi Adebayo",
    company: "Lekki Homes Ltd",
    quote: "The calculations were spot on. My solar system works perfectly for my family's needs.",
    avatar: "KA"
  },
  {
    name: "Emeka Okonkwo",
    company: "Port Harcourt Restaurants",
    quote: "WattWise made solar simple. My restaurant now runs on clean energy!",
    avatar: "EO"
  },
  {
    name: "Fatima Hassan",
    company: "Abuja Property Management",
    quote: "Professional service and accurate estimates. Highly recommend for any property owner.",
    avatar: "FH"
  },
  {
    name: "Tunde Johnson",
    company: "TechStart Nigeria",
    quote: "The best investment I've made. WattWise made the entire process seamless.",
    avatar: "TJ"
  },
  {
    name: "Grace Okafor",
    company: "Calabar Cuisine",
    quote: "My electricity bills are now history. Thank you WattWise for the perfect solution!",
    avatar: "GO"
  },
  {
    name: "David Okoro",
    company: "Benin Real Estate",
    quote: "WattWise helped me integrate solar into all my new developments. Game changer!",
    avatar: "DO"
  },
  {
    name: "Aisha Bello",
    company: "Kano Hospitality Group",
    quote: "Our hotel now runs on solar power. Guests love our eco-friendly approach!",
    avatar: "AB"
  },
  {
    name: "Michael Chukwudi",
    company: "Onitsha Manufacturing",
    quote: "Massive savings on operational costs. WattWise delivered exactly what they promised.",
    avatar: "MC"
  }
]

// Features data
const features = [
  {
    title: "Smart Calculations",
    description: "Get accurate solar system recommendations based on your actual energy consumption patterns.",
    icon: "⚡"
  },
  {
    title: "NEPA Integration",
    description: "Connect your NEPA meter readings for precise energy analysis and recommendations.",
    icon: "📊"
  },
  {
    title: "Appliance Analysis",
    description: "Input your appliances and get detailed breakdowns of your energy needs.",
    icon: "🏠"
  },
  {
    title: "Cost Savings",
    description: "See exactly how much you'll save on electricity bills with solar power.",
    icon: "💰"
  },
  {
    title: "Installation Guide",
    description: "Step-by-step guidance for solar panel installation and setup.",
    icon: "🔧"
  },
  {
    title: "24/7 Support",
    description: "Expert support team available to answer all your solar energy questions.",
    icon: "💬"
  }
]

// How it works steps
const howItWorks = [
  {
    step: "01",
    title: "Input Your Data",
    description: "Enter your NEPA meter readings or list your appliances to get started."
  },
  {
    step: "02",
    title: "Get Analysis",
    description: "Our AI analyzes your energy patterns and calculates your solar needs."
  },
  {
    step: "03",
    title: "Receive Recommendations",
    description: "Get detailed recommendations for solar panels, inverters, and batteries."
  },
  {
    step: "04",
    title: "Start Saving",
    description: "Implement your solar solution and start saving on electricity costs."
  }
]

// Pricing plans
const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for getting started with solar energy",
    features: [
      "Basic energy analysis",
      "Solar system recommendations",
      "Cost savings calculator",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "/month",
    description: "Advanced features for serious solar planning",
    features: [
      "Advanced energy analysis",
      "Detailed system specifications",
      "Installation guidance",
      "Priority support",
      "Custom reports",
      "Multiple property analysis"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₦25,000",
    period: "/month",
    description: "Complete solution for businesses and large properties",
    features: [
      "Everything in Pro",
      "Custom solar solutions",
      "Project management",
      "Dedicated account manager",
      "API access",
      "White-label options"
    ],
    popular: false
  }
]

// FAQ data
const faqs = [
  {
    question: "How accurate are the solar system calculations?",
    answer: "Our calculations are based on real energy consumption data and industry standards. We use advanced algorithms to provide accurate recommendations for your specific needs."
  },
  {
    question: "Can I use my NEPA meter readings?",
    answer: "Yes! WattWise can analyze your NEPA meter readings to understand your energy consumption patterns and provide tailored solar recommendations."
  },
  {
    question: "What if I don't have meter readings?",
    answer: "No problem! You can input your appliances and their usage patterns, and we'll calculate your energy needs based on that information."
  },
  {
    question: "How long does it take to see savings?",
    answer: "Most users start seeing savings within 3-6 months after installation, depending on their energy consumption and solar system size."
  },
  {
    question: "Do you provide installation services?",
    answer: "While we provide detailed installation guides and recommendations, we partner with certified installers across Nigeria for professional installation services."
  },
  {
    question: "What happens during power outages?",
    answer: "With a properly sized solar system and battery backup, you can continue using essential appliances during power outages."
  }
]

export default function Home() {
  const testimonialSectionRef = useRef<HTMLDivElement>(null)
  const featuresSectionRef = useRef<HTMLDivElement>(null)
  const howItWorksSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    if (testimonialSectionRef.current) {
      const topRowCards = testimonialSectionRef.current.querySelectorAll('.marquee-left .testimonial-card')
      const bottomRowCards = testimonialSectionRef.current.querySelectorAll('.marquee-right .testimonial-card')

      // Set initial state
      gsap.set([...topRowCards, ...bottomRowCards], { y: 100, opacity: 0 })

      // Create scroll-triggered animation for top row
      gsap.to(topRowCards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: testimonialSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Create scroll-triggered animation for bottom row with delay
      gsap.to(bottomRowCards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3, // Start after top row begins
        scrollTrigger: {
          trigger: testimonialSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })
    }

    // Features section animations
    if (featuresSectionRef.current) {
      const featureCards = featuresSectionRef.current.querySelectorAll('.feature-card')
      const featureIcons = featuresSectionRef.current.querySelectorAll('.feature-icon')
      const featureTitles = featuresSectionRef.current.querySelectorAll('.feature-title')
      const featureDescriptions = featuresSectionRef.current.querySelectorAll('.feature-description')

      // Set initial state
      gsap.set(featureCards, { y: 60, opacity: 0, scale: 0.9 })
      gsap.set(featureIcons, { scale: 0, rotation: -180 })
      gsap.set([featureTitles, featureDescriptions], { y: 20, opacity: 0 })

      // Create scroll-triggered animation for feature cards
      gsap.to(featureCards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Animate icons with delay
      gsap.to(featureIcons, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)",
        delay: 0.2,
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Animate text content with delay
      gsap.to([featureTitles, featureDescriptions], {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.4,
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // How It Works section animations
      if (howItWorksSectionRef.current) {
        const steps = howItWorksSectionRef.current.querySelectorAll('.how-it-works-step')
        const stepNumbers = howItWorksSectionRef.current.querySelectorAll('.step-number')
        const stepTitles = howItWorksSectionRef.current.querySelectorAll('.step-title')
        const stepDescriptions = howItWorksSectionRef.current.querySelectorAll('.step-description')
        const progressLine = howItWorksSectionRef.current.querySelector('.progress-line')

        // Set initial state
        gsap.set(steps, { y: 50, opacity: 0 })
        gsap.set(stepNumbers, { scale: 0, rotation: -180 })
        gsap.set([stepTitles, stepDescriptions], { y: 20, opacity: 0 })
        gsap.set(progressLine, { scaleX: 0, transformOrigin: "left" })

        // Create scroll-triggered animation for steps
        gsap.to(steps, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        })

        // Animate step numbers with delay
        gsap.to(stepNumbers, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.3,
          ease: "back.out(1.7)",
          delay: 0.2,
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        })

        // Animate text content with delay
        gsap.to([stepTitles, stepDescriptions], {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        })

        // Animate progress line
        gsap.to(progressLine, {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.5,
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary">
                WattWise
              </div>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#benefits" className="text-foreground/80 hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#faqs" className="text-foreground/80 hover:text-foreground transition-colors">
                FAQs
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
                Contact
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                Login
              </Button>
              <Button size="sm">
                Get Estimate
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-end justify-start p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background layers for future animations */}
        <div className="absolute inset-0 z-0">
          {/* Unicorn.studio interactive background */}
          {/* <UnicornStudioBackground /> */}
          <Image src="/images/hero.png" alt="Hero Background" fill className="object-cover" />

          {/* Solar-themed animated background placeholder */}
          <div className="absolute inset-0 opacity-10">
            {/* This div is reserved for future solar-themed SVG/canvas animations */}
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-secondary/20 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-accent/20 animate-pulse delay-500" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl">
          <AnimatedHeadline
            text="TAKE CHARGE OF YOUR POWER."
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-8"
          />
          <div className="mb-8">
            <Button size="lg" className="text-lg px-8 py-4">
              Calculate My Solar Needs
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Nigerians Nationwide
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our customers are saying about their solar journey
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative overflow-hidden" ref={testimonialSectionRef}>
            {/* Top Row - Scrolls Left */}
            <div className="flex space-x-6 mb-8">
              <div className="flex space-x-6 marquee-left">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={`duplicate-${index}`} {...testimonial} />
                ))}
              </div>
            </div>

            {/* Bottom Row - Scrolls Right */}
            <div className="flex space-x-6">
              <div className="flex space-x-6 marquee-right">
                {testimonials.slice().reverse().map((testimonial, index) => (
                  <TestimonialCard key={`bottom-${index}`} {...testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {testimonials.slice().reverse().map((testimonial, index) => (
                  <TestimonialCard key={`bottom-duplicate-${index}`} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="benefits" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Why Choose WattWise
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Smart Solar Solutions for Every Nigerian
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines advanced technology with local expertise to provide you with the most accurate solar energy solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={featuresSectionRef}>
            {features.map((feature, index) => (
              <Card key={index} className="feature-card border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="feature-icon text-3xl mb-4">{feature.icon}</div>
                  <CardTitle className="feature-title text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="feature-description text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How WattWise Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your personalized solar solution in just four simple steps
            </p>
          </div>

          <div className="relative" ref={howItWorksSectionRef}>
            {/* Progress Line */}
            <div className="hidden lg:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-border">
              <div className="progress-line h-full bg-primary transform scale-x-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="how-it-works-step text-center">
                  <div className="relative mb-6">
                    <div className="step-number w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="step-title text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="step-description text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Pricing Plans
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start your solar journey with our flexible pricing options designed for every budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-foreground">
                    {plan.price}
                    {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about solar energy and WattWise
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Solar Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerians who have already taken control of their energy costs with WattWise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Calculate My Solar Needs
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">WattWise</div>
              <p className="text-muted-foreground">
                Empowering Nigerians with smart solar solutions for a sustainable future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 WattWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ name, company, quote, avatar }: {
  name: string
  company: string
  quote: string
  avatar: string
}) {
  return (
    <Card className="testimonial-card w-80 flex-shrink-0 bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar fallback={avatar} className="w-12 h-12" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{company}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


