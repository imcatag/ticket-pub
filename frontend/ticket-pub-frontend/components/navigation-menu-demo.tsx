"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm, ProfileForm, PurchasedTicket } from "@/components/login-form"
import { Plus, ShoppingCart, Trash2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
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

// Add available genres constant
const AVAILABLE_GENRES = ["Rock", "Pop", "Drum & Bass", "Techno"];

// Update the ProfileForm props type
type ProfileFormProps = {
  initialProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
}

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

export function NavigationMenuDemo({ 
  cartItems, 
  setCartItems,
  userProfile,
  setUserProfile,
  events,
  setEvents
}: { 
  cartItems: CartItem[], 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  userProfile: UserProfile | null,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  events: Event[],
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}) {
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [showProfileDialog, setShowProfileDialog] = React.useState(false);
  const [showCartDialog, setShowCartDialog] = React.useState(false);
  const [showAdminDialog, setShowAdminDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [newEvent, setNewEvent] = React.useState<Partial<Event>>({
    title: '',
    description: '',
    genre: 'Rock',
    genreColor: 'blue',
    fullDescription: '',
    intensity: 'chill'
  });
  const [useProfilePreferences, setUseProfilePreferences] = React.useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.normalTickets + item.vipTickets, 0);
  const totalPrice = cartItems.reduce((sum, item) => 
    sum + (item.normalTickets * item.normalPrice) + (item.vipTickets * item.vipPrice), 0);

  const handleRemoveFromCart = (eventId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.eventId !== eventId));
  };

  const handleLogin = (profile: UserProfile) => {
    // Initialize with empty preferences if not present
    const profileWithPreferences = {
      ...profile,
      preferredGenres: profile.preferredGenres || []
    };
    setUserProfile(profileWithPreferences);
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

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description || !newEvent.fullDescription) return;

    const event: Event = {
      id: events.length + 1,
      title: newEvent.title,
      description: newEvent.description,
      genre: newEvent.genre || 'Rock',
      genreColor: newEvent.genreColor || 'blue',
      fullDescription: newEvent.fullDescription,
      intensity: newEvent.intensity || 'chill'
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      genre: 'Rock',
      genreColor: 'blue',
      fullDescription: '',
      intensity: 'chill'
    });
  };

  const handleRemoveEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    setShowEditDialog(false);
    setEditingEvent(null);
  };

  const genres = ["all", "Rock", "Pop", "Drum & Bass", "Techno"];
  const intensities = ["all", "chill", "hardcore", "mixed"] as const;

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => setShowAdminDialog(true)}
            >
              Admin
            </NavigationMenuLink>
          </NavigationMenuItem>
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {userProfile && (
            <ProfileForm 
              profile={userProfile}
              onSave={handleSaveProfile}
              onLogout={handleLogout}
              availableGenres={genres.filter(g => g !== "all")}
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

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Management</DialogTitle>
            <DialogDescription>
              Add new events or manage existing ones
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Event Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Event</CardTitle>
                <CardDescription>
                  Fill in the details for a new event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Short Description</Label>
                      <Input
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter short description"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fullDescription">Full Description</Label>
                      <Textarea
                        id="fullDescription"
                        value={newEvent.fullDescription}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, fullDescription: e.target.value }))}
                        placeholder="Enter detailed description"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select
                        value={newEvent.genre}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, genre: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rock">Rock</SelectItem>
                          <SelectItem value="Pop">Pop</SelectItem>
                          <SelectItem value="Drum & Bass">Drum & Bass</SelectItem>
                          <SelectItem value="Techno">Techno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="genreColor">Genre Color</Label>
                      <Select
                        value={newEvent.genreColor}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, genreColor: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="yellow">Yellow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="intensity">Event Intensity</Label>
                      <Select
                        value={newEvent.intensity}
                        onValueChange={(value: 'chill' | 'hardcore' | 'mixed') => 
                          setNewEvent(prev => ({ ...prev, intensity: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chill">Chill</SelectItem>
                          <SelectItem value="hardcore">Hardcore</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Event List */}
            <Card className="flex flex-col h-[650px] md:h-[680px]">
              <CardHeader className="flex-none">
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>
                  View and manage existing events
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto pr-2">
                  {events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <Card 
                          key={event.id}
                          className="cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => handleEditEvent(event)}
                        >
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveEvent(event.id);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 bg-${event.genreColor}-100 text-${event.genreColor}-800 rounded-full text-xs`}>
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
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No events available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) setEditingEvent(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Modify the event details
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)
                    }
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Short Description</Label>
                  <Input
                    id="edit-description"
                    value={editingEvent.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)
                    }
                    placeholder="Enter short description"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fullDescription">Full Description</Label>
                  <Textarea
                    id="edit-fullDescription"
                    value={editingEvent.fullDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setEditingEvent(prev => prev ? { ...prev, fullDescription: e.target.value } : null)
                    }
                    placeholder="Enter detailed description"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Select
                    value={editingEvent.genre}
                    onValueChange={(value) => 
                      setEditingEvent(prev => prev ? { ...prev, genre: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Drum & Bass">Drum & Bass</SelectItem>
                      <SelectItem value="Techno">Techno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-genreColor">Genre Color</Label>
                  <Select
                    value={editingEvent.genreColor}
                    onValueChange={(value) => 
                      setEditingEvent(prev => prev ? { ...prev, genreColor: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-intensity">Event Intensity</Label>
                  <Select
                    value={editingEvent.intensity}
                    onValueChange={(value: 'chill' | 'hardcore' | 'mixed') => 
                      setEditingEvent(prev => prev ? { ...prev, intensity: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chill">Chill</SelectItem>
                      <SelectItem value="hardcore">Hardcore</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
