"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  PenTool,
  FileText,
  ArrowRight,
  Calendar,
  Shield,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const createQuickRoom = () => {
    const demoRoomId = nanoid();
    router.push(`/instant/d-${demoRoomId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MeetCanvas</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#try-it-now"
              className="text-sm font-medium hover:text-primary"
            >
              Try It Now
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Collaborate in real-time with{" "}
                  <span className="text-primary">MeetCanvas</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create virtual meeting rooms with integrated video, audio,
                  collaborative canvas, and file storage — all in one seamless
                  platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" onClick={() => router.push("/sign-up")}>
                    <span className="flex items-center">
                      Start for free <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#demo">Watch demo</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                      >
                        <Image
                          src={`/placeholder.svg?height=32&width=32&text=${i}`}
                          alt="User avatar"
                          width={32}
                          height={32}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Join <span className="font-medium">2,000+</span> teams
                    already collaborating
                  </div>
                </div>
              </div>
              <div className="relative h-[350px] lg:h-[500px] rounded-xl overflow-hidden border shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=MeetCanvas+Demo"
                  alt="MeetCanvas platform preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything you need for seamless collaboration
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  MeetCanvas combines the best tools for remote teams in one
                  intuitive platform.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">HD Video & Audio</h3>
                <p className="text-center text-muted-foreground">
                  Crystal clear video and audio communication for teams of any
                  size, with noise cancellation and background blur.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Persistent Canvas</h3>
                <p className="text-center text-muted-foreground">
                  Collaborative whiteboard that stays between sessions, allowing
                  teams to visualize ideas and track progress over time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Room Storage</h3>
                <p className="text-center text-muted-foreground">
                  Each meeting room has dedicated storage for files and
                  documents, making it easy to access important resources.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Room Management</h3>
                <p className="text-center text-muted-foreground">
                  Create, customize, and manage multiple meeting rooms from a
                  central dashboard with easy invitation options.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Team Permissions</h3>
                <p className="text-center text-muted-foreground">
                  Control who can access, edit, and manage each room with
                  granular permission settings for team members.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Enterprise Security</h3>
                <p className="text-center text-muted-foreground">
                  End-to-end encryption and compliance with industry standards
                  to keep your teams communications secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple, intuitive, and powerful
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Get started in minutes and transform how your team
                  collaborates.
                </p>
              </div>
            </div>
            <div className="mt-16 grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create a Room</h3>
                <p className="text-center text-muted-foreground">
                  Set up a new meeting room in seconds from your dashboard. Name
                  it, customize it, and set permissions.
                </p>
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Create+Room"
                  alt="Create a room"
                  width={300}
                  height={200}
                  className="rounded-lg border shadow-sm"
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Invite Your Team</h3>
                <p className="text-center text-muted-foreground">
                  Send invitations via email or share a link. Team members can
                  join with a single click.
                </p>
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Invite+Team"
                  alt="Invite team"
                  width={300}
                  height={200}
                  className="rounded-lg border shadow-sm"
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Collaborate Seamlessly</h3>
                <p className="text-center text-muted-foreground">
                  Meet, discuss, draw, and share files all in one place. Your
                  work is saved automatically.
                </p>
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Collaborate"
                  alt="Collaborate"
                  width={300}
                  height={200}
                  className="rounded-lg border shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Loved by teams worldwide
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  See what our users have to say about MeetCanvas.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "MeetCanvas has transformed how our design team collaborates. The persistent canvas feature is a game-changer for our creative process.",
                  author: "Sarah Johnson",
                  role: "Design Director, CreativeHub",
                },
                {
                  quote:
                    "We've tried dozens of collaboration tools, but MeetCanvas is the first one that truly combines everything we need in one seamless platform.",
                  author: "Michael Chen",
                  role: "Product Manager, TechInnovate",
                },
                {
                  quote:
                    "The ability to store files directly in meeting rooms has made our client presentations so much more organized and professional.",
                  author: "Emma Rodriguez",
                  role: "Client Success Manager, ConsultPro",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-background p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-primary"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=${testimonial.author.charAt(
                            0
                          )}`}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Try It Now */}
        <section id="try-it-now" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Try It Now
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Create a quick room in seconds
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  No sign up required. Just create a room and share the link
                  with your team.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-md space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter a room name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button onClick={createQuickRoom} className="sm:w-auto">
                  Create Room
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                By creating a room, you agree to our{" "}
                <Link href="#" className="underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center justify-center">
              <div className="relative h-[350px] w-full max-w-3xl rounded-xl overflow-hidden border shadow-xl">
                <Image
                  src="/placeholder.svg?height=350&width=800&text=Quick+Room+Preview"
                  alt="Quick room preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Your room includes video, audio, canvas, and file storage —
                  all ready to use instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform how your team collaborates?
                </h2>
                <p className="max-w-[600px] opacity-90 md:text-xl">
                  Join thousands of teams already using MeetCanvas to work
                  better together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Button size="lg" variant="secondary">
                  <Link href="/demo">Watch demo</Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-background text-primary hover:bg-background/90"
                >
                  <Link href="#try-it-now">
                    Try a quick room <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently asked questions
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to know about MeetCanvas.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-4 md:gap-8 lg:grid-cols-2">
              {[
                {
                  q: "How many people can join a meeting room?",
                  a: "Our quick rooms support up to 10 participants. For larger teams, you can sign up for our full version which supports up to 100 participants per room.",
                },
                {
                  q: "Is my data secure?",
                  a: "Yes, we use end-to-end encryption for all communications and follow industry best practices for data security. Your content is only accessible to you and the people you invite.",
                },
                {
                  q: "Can I access my meeting rooms on mobile devices?",
                  a: "MeetCanvas works on all modern browsers and we have dedicated apps for iOS and Android devices.",
                },
                {
                  q: "How long do meeting rooms stay active?",
                  a: "Quick rooms stay active for 24 hours. For persistent rooms, you'll need to create an account.",
                },
                {
                  q: "Can I integrate MeetCanvas with other tools?",
                  a: "Yes, we offer integrations with popular tools like Slack, Microsoft Teams, Google Workspace, and more.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "No, you can create and join quick rooms without an account. However, creating an account gives you access to more features and persistent rooms.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border p-6">
                  <h3 className="text-lg font-bold">{faq.q}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MeetCanvas</span>
              </div>
              <p className="mt-4 text-muted-foreground">
                Transforming how teams collaborate with integrated video, audio,
                canvas, and file storage solutions.
              </p>
              <div className="mt-6 flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <Link
                      key={social}
                      href={`#${social}`}
                      className="rounded-full bg-muted p-2 text-muted-foreground hover:text-primary"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-5 w-5" />
                    </Link>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-3">
                {[
                  "Features",
                  "Pricing",
                  "Integrations",
                  "Roadmap",
                  "Changelog",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "Tutorials", "Blog", "Support", "API"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-3">
                {["About", "Careers", "Contact", "Privacy", "Terms"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MeetCanvas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
