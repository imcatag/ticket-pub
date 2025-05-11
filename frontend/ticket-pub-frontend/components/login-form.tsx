import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Download } from "lucide-react"

// Add ticket type
export type PurchasedTicket = {
  id: string;
  eventId: number;
  eventTitle: string;
  normalTickets: number;
  vipTickets: number;
  purchaseDate: string;
  totalPrice: number;
}

type UserProfile = {
  email: string;
  name: string;
  location: string;
  phone: string;
  city?: string;
  zipCode?: string;
  tickets?: PurchasedTicket[];
}

export function LoginForm({
  className,
  onLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onLogin: (profile: UserProfile) => void;
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    // Accept any non-empty email and password
    onLogin({
      email,
      name: email.split('@')[0], // Use part of email as default name
      location: "",
      phone: ""
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProfileForm({
  className,
  profile,
  onSave,
  onLogout,
  ...props
}: React.ComponentProps<"div"> & {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
}) {
  const [formData, setFormData] = useState(profile)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDownloadTicket = (ticket: PurchasedTicket) => {
    // Create a simple ticket PDF or image
    const ticketContent = `
      Event: ${ticket.eventTitle}
      Tickets: ${ticket.normalTickets} Normal, ${ticket.vipTickets} VIP
      Purchase Date: ${ticket.purchaseDate}
      Total: $${ticket.totalPrice}
      Ticket ID: ${ticket.id}
    `;
    
    // Create a blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)} {...props}>
      {/* Profile Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode || ''}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button type="button" variant="outline" onClick={onLogout}>Log Out</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* My Tickets Card */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="flex-none">
          <CardTitle>My Tickets</CardTitle>
          <CardDescription>
            View and download your purchased tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto pr-2">
            {formData.tickets && formData.tickets.length > 0 ? (
              <div className="space-y-4">
                {formData.tickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">{ticket.eventTitle}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTicket(ticket)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Purchase Date:</span>
                          <span>{ticket.purchaseDate}</span>
                        </div>
                        {ticket.normalTickets > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Normal Tickets:</span>
                            <span>{ticket.normalTickets}</span>
                          </div>
                        )}
                        {ticket.vipTickets > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>VIP Tickets:</span>
                            <span>{ticket.vipTickets}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total:</span>
                          <span>${ticket.totalPrice}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No tickets purchased yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
