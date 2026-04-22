import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Star, MapPin, DollarSign, TrendingUp, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminMatchmaking() {
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [requiredRole, setRequiredRole] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [matches, setMatches] = useState<any[]>([]);

  const findMatchesMutation = trpc.matchmaking.findMatches.useMutation({
    onSuccess: (data) => {
      setMatches(data);
      if (data.length === 0) {
        toast.info("No staff members found matching your criteria");
      } else {
        toast.success(`${data.length} professionals found!`);
      }
    },
    onError: (err) => {
      toast.error("Error searching: " + err.message);
    },
  });

  const handleSearch = () => {
    if (!eventDate || !location || !requiredRole) {
      toast.error("Please fill in all required fields");
      return;
    }
    findMatchesMutation.mutate({
      eventDate,
      location,
      requiredRoles: [requiredRole],
      maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100 border-green-200";
    if (score >= 75) return "bg-yellow-100 border-yellow-200";
    return "bg-orange-100 border-orange-200";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0c1b33] uppercase tracking-wider">
            AI Matchmaking
          </h1>
          <p className="text-gray-600 mt-2">
            Find the best professionals for your event using our intelligent algorithm
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-[#D4AF37]" />
              Search Criteria
            </CardTitle>
            <CardDescription>
              Fill in the event details to find the best professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="London, UK"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Required Role *</Label>
                <Select value={requiredRole} onValueChange={setRequiredRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                    <SelectItem value="Bartender">Bartender</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Max Budget (£/h)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g. 150"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleSearch}
                disabled={findMatchesMutation.isPending}
                className="bg-[#D4AF37] hover:bg-[#B8962E] text-[#0c1b33] font-semibold"
              >
                {findMatchesMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find Best Professionals
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {matches.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0c1b33] mb-4">
              {matches.length} Professionals Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match, index) => (
                <Card
                  key={match.staffId}
                  className={`border-2 ${getScoreBg(match.score)} relative`}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-[#D4AF37] text-[#0c1b33] font-bold">
                        Best Match
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-[#0c1b33]">{match.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="text-sm font-medium">{Number(match.rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(match.score)}`}>
                        {match.score}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">£{match.hourlyRate}/h</span>
                    </div>

                    <div className="space-y-1">
                      {match.matchReasons.map((reason: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <TrendingUp className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-4 bg-[#0c1b33] hover:bg-[#0c1b33]/80 text-white"
                      size="sm"
                      onClick={() => toast.success(`${match.name} selected! Go to the event to assign them.`)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Select Professional
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && !findMatchesMutation.isPending && (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center text-gray-400">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No results yet</p>
              <p className="text-sm mt-1">Fill in the criteria above and click "Find Best Professionals"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
