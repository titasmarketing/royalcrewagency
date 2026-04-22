import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Clock, CheckCircle, Calendar, Loader2, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { trpc } from "@/lib/trpc";

export default function StaffWallet() {
  const { data: myJobs, isLoading } = trpc.staff.myJobs.useQuery();

  const completedJobs = myJobs?.filter(j => j.event?.status === 'completed') || [];
  const pendingJobs = myJobs?.filter(j => j.event?.status !== 'completed' && (j.status === 'accepted' || j.status === 'confirmed')) || [];

  const calculateEarnings = (job: any) => {
    const hours = job.hoursWorked || job.event?.serviceHours || 0;
    const rate = parseFloat(job.hourlyRate || '0');
    return hours * rate;
  };

  const totalEarned = completedJobs.reduce((sum, j) => sum + calculateEarnings(j), 0);
  const totalPending = pendingJobs.reduce((sum, j) => sum + calculateEarnings(j), 0);

  const getStatusBadge = (job: any) => {
    const eventStatus = job.event?.status;
    if (eventStatus === 'completed') return { label: "Paid", variant: "default" as const, color: "text-green-600" };
    if (job.status === 'accepted' || job.status === 'confirmed') return { label: "Pending", variant: "secondary" as const, color: "text-yellow-600" };
    return { label: "Invited", variant: "outline" as const, color: "text-blue-600" };
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0c1b33] uppercase tracking-wider">My Wallet</h1>
          <p className="text-gray-600 mt-2">Track your earnings and payment history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Earned</p>
                  <p className="text-3xl font-bold text-green-600">£ {totalEarned.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">{completedJobs.length} completed events</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">£ {totalPending.toFixed(2)}</p>
                  <p className="text-xs text-yellow-600 mt-1">{pendingJobs.length} upcoming events</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-200 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Jobs</p>
                  <p className="text-3xl font-bold text-blue-600">{myJobs?.length || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#D4AF37]" />
              Job History
            </CardTitle>
            <CardDescription>Your assigned events and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {["all", "pending", "completed"].map((tab) => {
                const jobs = tab === "all" ? myJobs || [] :
                             tab === "pending" ? pendingJobs : completedJobs;
                return (
                  <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                    {jobs.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No jobs {tab === "all" ? "yet" : `in ${tab}`}</p>
                        <p className="text-sm">Your assigned events will appear here</p>
                      </div>
                    ) : (
                      jobs.map((job: any) => {
                        const statusBadge = getStatusBadge(job);
                        const earnings = calculateEarnings(job);
                        return (
                          <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-[#D4AF37]/50 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-[#D4AF37]" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{job.event?.title || 'Event'}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.event?.eventDate ? format(new Date(job.event.eventDate), "dd/MM/yyyy", { locale: enGB }) : 'Date TBD'}
                                  {job.event?.serviceHours ? ` • ${job.event.serviceHours}h` : ''}
                                </p>
                                <p className="text-xs text-muted-foreground">{job.role || 'Staff'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {earnings > 0 ? (
                                <div className={`text-xl font-bold ${statusBadge.color}`}>£ {earnings.toFixed(2)}</div>
                              ) : (
                                <div className="text-sm text-muted-foreground">{job.hourlyRate ? `£${job.hourlyRate}/h` : 'Rate TBD'}</div>
                              )}
                              <Badge variant={statusBadge.variant} className="mt-1">{statusBadge.label}</Badge>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
