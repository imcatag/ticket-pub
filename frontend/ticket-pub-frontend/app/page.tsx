import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import Link from "next/link"
import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  return data;
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/login" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Log In
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function Home() {
  return (
    <div>
      {/* top of the page, should have  */}
      <div >
        <div className="flex justify-center items-center">
          <Image src="/images/placeholder_black.png" alt="logo" width={200} height={200} />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <NavigationMenuDemo />
      </div>
      {/* upcoming event section, should be a big card with time until, TITLE, DESCRIPTION, tags, and a button. on the right, add an image of the event */}
      <div className="flex justify-center items-center">
        <Card className="w-[80%] h-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">UPCOMING EVENT</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <h2 className="text-3xl font-bold mb-4">Event Title</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Music</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Concert</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Live</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center p-4">
              <Image 
                src="/images/placeholderevent.bmp" 
                alt="Event Image" 
                width={300} 
                height={200}
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Grid of upcoming events */}
      <div className="flex justify-center mt-8">
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Event 1</CardTitle>
              <CardDescription>Upcoming event description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Category</span>
              </div>
              <p className="text-gray-600">Short description of the event and what to expect.</p>
            </CardContent>
          </Card>

          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Event 2</CardTitle>
              <CardDescription>Upcoming event description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Category</span>
              </div>
              <p className="text-gray-600">Short description of the event and what to expect.</p>
            </CardContent>
          </Card>

          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Event 3</CardTitle>
              <CardDescription>Upcoming event description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Category</span>
              </div>
              <p className="text-gray-600">Short description of the event and what to expect.</p>
            </CardContent>
          </Card>

          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Event 4</CardTitle>
              <CardDescription>Upcoming event description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Category</span>
              </div>
              <p className="text-gray-600">Short description of the event and what to expect.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
