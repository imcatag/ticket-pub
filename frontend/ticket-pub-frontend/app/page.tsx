"use client"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LoginForm, ProfileForm, PurchasedTicket } from "@/components/login-form"
import { ShoppingCart, X, User, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NavigationMenuDemo } from "@/components/navigation-menu-demo"
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

// Update the CartItem type definition
type CartItem = {
  eventId: number;
  eventTitle: string;
  normalTickets: number;
  vipTickets: number;
  normalPrice: number;
  vipPrice: number;
}

// Update the UserProfile type to match the one from login-form
type UserProfile = {
  email: string;
  name: string;
  location: string;
  phone: string;
  city?: string;
  zipCode?: string;
  tickets?: PurchasedTicket[];
  preferredGenres: string[];
}

// Add event type
type Event = {
  id: number;
  title: string;
  description: string;
  genre: string;
  genreColor: string;
  fullDescription: string;
  intensity: 'chill' | 'hardcore' | 'mixed';
}


export default function Home() {
  const [selectedEvent, setSelectedEvent] = React.useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = React.useState<string>("all");
  const [selectedIntensity, setSelectedIntensity] = React.useState<string>("all");
  const [normalTickets, setNormalTickets] = React.useState(0);
  const [vipTickets, setVipTickets] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: 1,
      title: "Event 1",
      description: "Upcoming event description",
      genre: "Rock",
      genreColor: "blue",
      fullDescription: "Detailed description of Event 1. This is a longer description that provides more information about the event, its location, and what attendees can expect.",
      intensity: "chill"
    },
    {
      id: 2,
      title: "Event 2",
      description: "Upcoming event description",
      genre: "Pop",
      genreColor: "green",
      fullDescription: "Detailed description of Event 2. This is a longer description that provides more information about the event, its location, and what attendees can expect.",
      intensity: "chill"
    },
    {
      id: 3,
      title: "Event 3",
      description: "Upcoming event description",
      genre: "Drum & Bass",
      genreColor: "purple",
      fullDescription: "Detailed description of Event 3. This is a longer description that provides more information about the event, its location, and what attendees can expect.",
      intensity: "mixed"
    },
    {
      id: 4,
      title: "Event 4",
      description: "Upcoming event description",
      genre: "Techno",
      genreColor: "yellow",
      fullDescription: "Detailed description of Event 4. This is a longer description that provides more information about the event, its location, and what attendees can expect.",
      intensity: "hardcore"
    }
  ]);
  const [useProfilePreferences, setUseProfilePreferences] = React.useState(false);

  const genres = ["all", "Rock", "Pop", "Drum & Bass", "Techno"];
  const intensities = ["all", "chill", "hardcore", "mixed"] as const;

  const filteredEvents = events.filter(event => {
    const matchesGenre = selectedGenre === "all" || event.genre === selectedGenre;
    const matchesIntensity = selectedIntensity === "all" || event.intensity === selectedIntensity;
    
    if (useProfilePreferences && userProfile) {
      const matchesPreferredGenre = userProfile.preferredGenres.includes(event.genre);
      return matchesPreferredGenre && matchesIntensity;
    }
    
    return matchesGenre && matchesIntensity;
  });

  const handleAddToCart = () => {
    if (selectedEvent && (normalTickets > 0 || vipTickets > 0)) {
      const event = events[selectedEvent - 1];
      const newCartItem: CartItem = {
        eventId: event.id,
        eventTitle: event.title,
        normalTickets,
        vipTickets,
        normalPrice: 50,
        vipPrice: 100
      };

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.eventId === event.id);
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            normalTickets: updatedItems[existingItemIndex].normalTickets + normalTickets,
            vipTickets: updatedItems[existingItemIndex].vipTickets + vipTickets
          };
          return updatedItems;
        }
        return [...prevItems, newCartItem];
      });

      setSelectedEvent(null);
      setNormalTickets(0);
      setVipTickets(0);
    }
  };

  return (
    <div>
      {/* top of the page, should have  */}
      <div >
        <div className="flex justify-center items-center">
          <Image src="/images/placeholder_black.png" alt="logo" width={200} height={200} />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <NavigationMenuDemo 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          userProfile={userProfile} 
          setUserProfile={setUserProfile}
          events={events}
          setEvents={setEvents}
        />
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
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Pop</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Chill</span>
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
        <div className="w-[80%]">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {!useProfilePreferences && (
                  <>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre === "all" ? "All Genres" : genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        {intensities.map((intensity) => (
                          <SelectItem key={intensity} value={intensity}>
                            {intensity === "all" ? "All Intensities" : intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              {userProfile && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useProfilePreferences"
                    checked={useProfilePreferences}
                    onChange={(e) => setUseProfilePreferences(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="useProfilePreferences" className="text-sm font-medium whitespace-nowrap">
                    Filter by my preferences
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="h-auto cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedEvent(event.id)}
              >
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 bg-${event.genreColor}-100 text-${event.genreColor}-800 rounded-full text-sm`}>
                      {event.genre}
                    </span>
                    <span className={`px-3 py-1 ${
                      event.intensity === 'chill' ? 'bg-green-100 text-green-800' :
                      event.intensity === 'hardcore' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    } rounded-full text-sm`}>
                      {event.intensity.charAt(0).toUpperCase() + event.intensity.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">Short description of the event and what to expect.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-7xl p-0 bg-transparent border-0 shadow-none max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl">{events[selectedEvent - 1].title}</CardTitle>
                  <CardDescription>{events[selectedEvent - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <p className="text-gray-600">{events[selectedEvent - 1].fullDescription}</p>
                    <div className="flex gap-2 mt-4">
                      <span className={`px-3 py-1 bg-${events[selectedEvent - 1].genreColor}-100 text-${events[selectedEvent - 1].genreColor}-800 rounded-full text-sm`}>
                        {events[selectedEvent - 1].genre}
                      </span>
                      <span className={`px-3 py-1 ${
                        events[selectedEvent - 1].intensity === 'chill' ? 'bg-green-100 text-green-800' :
                        events[selectedEvent - 1].intensity === 'hardcore' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      } rounded-full text-sm`}>
                        {events[selectedEvent - 1].intensity.charAt(0).toUpperCase() + events[selectedEvent - 1].intensity.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Image 
                      src="/images/placeholderevent.bmp" 
                      alt="Event Image" 
                      width={200} 
                      height={200}
                      className="rounded-lg w-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Select Tickets</CardTitle>
                  <CardDescription>Choose the number of tickets you want to purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Normal Tickets</h4>
                        <p className="text-sm text-gray-500">$50 per ticket</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNormalTickets(Math.max(0, normalTickets - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{normalTickets}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNormalTickets(normalTickets + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">VIP Tickets</h4>
                        <p className="text-sm text-gray-500">$100 per ticket</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setVipTickets(Math.max(0, vipTickets - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{vipTickets}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setVipTickets(vipTickets + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Normal Tickets</span>
                      <span>${normalTickets * 50}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>VIP Tickets</span>
                      <span>${vipTickets * 100}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${normalTickets * 50 + vipTickets * 100}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={normalTickets === 0 && vipTickets === 0}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
