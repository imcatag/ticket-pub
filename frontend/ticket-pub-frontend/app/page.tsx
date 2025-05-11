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
import { ShoppingCart, X, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
}

export function NavigationMenuDemo({ 
  cartItems, 
  setCartItems,
  userProfile,
  setUserProfile
}: { 
  cartItems: CartItem[], 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  userProfile: UserProfile | null,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>> 
}) {
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [showProfileDialog, setShowProfileDialog] = React.useState(false);
  const [showCartDialog, setShowCartDialog] = React.useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.normalTickets + item.vipTickets, 0);
  const totalPrice = cartItems.reduce((sum, item) => 
    sum + (item.normalTickets * item.normalPrice) + (item.vipTickets * item.vipPrice), 0);

  const handleRemoveFromCart = (eventId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.eventId !== eventId));
  };

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowLoginDialog(false);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setShowProfileDialog(false);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setShowProfileDialog(false);
  };

  const handleCheckout = () => {
    if (!userProfile) {
      setShowCartDialog(false);
      setShowLoginDialog(true);
      return;
    }

    // Create purchased tickets from cart items
    const purchasedTickets: PurchasedTicket[] = cartItems.map(item => ({
      id: `${item.eventId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId: item.eventId,
      eventTitle: item.eventTitle,
      normalTickets: item.normalTickets,
      vipTickets: item.vipTickets,
      purchaseDate: new Date().toLocaleDateString(),
      totalPrice: (item.normalTickets * item.normalPrice) + (item.vipTickets * item.vipPrice)
    }));

    // Update user profile with new tickets
    setUserProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tickets: [...(prev.tickets || []), ...purchasedTickets]
      };
    });

    // Clear cart
    setCartItems([]);
    setShowCartDialog(false);
  };

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => userProfile ? setShowProfileDialog(true) : setShowLoginDialog(true)}
            >
              {userProfile ? (
                <div className="flex items-center h-5">
                  <User className="h-5 w-5" />
                  <span className="ml-2 text-sm">{userProfile.name}</span>
                </div>
              ) : (
                "Log In"
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => setShowCartDialog(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <LoginForm onLogin={handleLogin} />
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-4xl">
          {userProfile && (
            <ProfileForm 
              profile={userProfile}
              onSave={handleSaveProfile}
              onLogout={handleLogout}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>
              Review your selected tickets and provide delivery information
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Cart items */}
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <Card key={item.eventId}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg">{item.eventTitle}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(item.eventId)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {item.normalTickets > 0 && (
                            <div className="flex justify-between">
                              <span>Normal Tickets ({item.normalTickets})</span>
                              <span>${item.normalTickets * item.normalPrice}</span>
                            </div>
                          )}
                          {item.vipTickets > 0 && (
                            <div className="flex justify-between">
                              <span>VIP Tickets ({item.vipTickets})</span>
                              <span>${item.vipTickets * item.vipPrice}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right side - Checkout form */}
            {cartItems.length > 0 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                    <CardDescription>
                      {userProfile 
                        ? "Your delivery information is pre-filled from your profile"
                        : "Please provide your contact details for ticket delivery"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            placeholder="John Doe"
                            value={userProfile?.name || ''}
                            disabled={!!userProfile}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com"
                            value={userProfile?.email || ''}
                            disabled={!!userProfile}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+1 (555) 000-0000"
                            value={userProfile?.phone || ''}
                            disabled={!!userProfile}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            placeholder="123 Main St"
                            value={userProfile?.location || ''}
                            disabled={!!userProfile}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                              id="city" 
                              placeholder="New York"
                              value={userProfile?.city || ''}
                              disabled={!!userProfile}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input 
                              id="zipCode" 
                              placeholder="10001"
                              value={userProfile?.zipCode || ''}
                              disabled={!!userProfile}
                            />
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4"
                        onClick={handleCheckout}
                      >
                        {userProfile ? 'Complete Purchase' : 'Login to Checkout'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Home() {
  const [selectedEvent, setSelectedEvent] = React.useState<number | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const [normalTickets, setNormalTickets] = React.useState(0);
  const [vipTickets, setVipTickets] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  const events = [
    {
      id: 1,
      title: "Event 1",
      description: "Upcoming event description",
      category: "Music",
      categoryColor: "blue",
      fullDescription: "Detailed description of Event 1. This is a longer description that provides more information about the event, its location, and what attendees can expect."
    },
    {
      id: 2,
      title: "Event 2",
      description: "Upcoming event description",
      category: "Sports",
      categoryColor: "green",
      fullDescription: "Detailed description of Event 2. This is a longer description that provides more information about the event, its location, and what attendees can expect."
    },
    {
      id: 3,
      title: "Event 3",
      description: "Upcoming event description",
      category: "Art",
      categoryColor: "purple",
      fullDescription: "Detailed description of Event 3. This is a longer description that provides more information about the event, its location, and what attendees can expect."
    },
    {
      id: 4,
      title: "Event 4",
      description: "Upcoming event description",
      category: "Food",
      categoryColor: "yellow",
      fullDescription: "Detailed description of Event 4. This is a longer description that provides more information about the event, its location, and what attendees can expect."
    }
  ];

  const tags = ["all", "Music", "Sports", "Art", "Food"];

  const filteredEvents = selectedTag === "all" 
    ? events 
    : events.filter(event => event.category === selectedTag);

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
        <NavigationMenuDemo cartItems={cartItems} setCartItems={setCartItems} userProfile={userProfile} setUserProfile={setUserProfile} />
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
        <div className="w-[80%]">
          <div className="mb-6">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <span className={`px-3 py-1 bg-${event.categoryColor}-100 text-${event.categoryColor}-800 rounded-full text-sm`}>
                      {event.category}
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
        <DialogContent className="max-w-7xl p-0 bg-transparent border-0 shadow-none">
          {selectedEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl">{events[selectedEvent - 1].title}</CardTitle>
                  <CardDescription>{events[selectedEvent - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <p className="text-gray-600">{events[selectedEvent - 1].fullDescription}</p>
                    <div className="flex gap-2 mt-4">
                      <span className={`px-3 py-1 bg-${events[selectedEvent - 1].categoryColor}-100 text-${events[selectedEvent - 1].categoryColor}-800 rounded-full text-sm`}>
                        {events[selectedEvent - 1].category}
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
