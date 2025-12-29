import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Crown, Calendar, DollarSign, Star, MapPin } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function StaffPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: myJobs, isLoading } = trpc.events.list.useQuery();
  const { data: staffProfile } = trpc.staff.list.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center text-[#D4AF37]">
        Carregando Portal Staff...
      </div>
    );
  }

  // Encontrar perfil do staff logado
  const myProfile = staffProfile?.find((s) => s.userId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Staff */}
      <nav className="bg-[#0c1b33] border-b border-[#D4AF37]/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <Crown className="text-[#D4AF37] w-6 h-6" />
              <span className="text-white font-bold tracking-[0.2em] text-sm uppercase">
                Royal Staff
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-[10px] uppercase font-bold hidden md:inline">
              {user.name}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-light text-[#0c1b33] tracking-wider">
            Olá, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            Bem-vindo ao seu portal profissional
          </p>
        </header>

        {/* Perfil do Staff */}
        {myProfile && (
          <Card className="mb-12 border-[#D4AF37]/30 shadow-xl bg-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#0c1b33] mb-4 uppercase tracking-wider">
                  Seu Perfil
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Avaliação
                      </p>
                      <p className="text-lg font-bold text-[#0c1b33]">
                        {myProfile.rating ? `${myProfile.rating}/5.0` : "Sem avaliações"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Taxa Horária
                      </p>
                      <p className="text-lg font-bold text-[#0c1b33]">
                        £{myProfile.hourlyRate}/hora
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Localização
                      </p>
                      <p className="text-lg font-bold text-[#0c1b33]">
                        {myProfile.county || "Não informado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Especialidades
                      </p>
                      <p className="text-lg font-bold text-[#0c1b33]">
                        {myProfile.specialties || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33] font-bold uppercase tracking-wider">
                  Editar Perfil
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Carteira do Staff */}
        <Card className="mb-12 border-[#D4AF37]/30 shadow-xl bg-white p-8">
          <h2 className="text-2xl font-bold text-[#0c1b33] mb-6 uppercase tracking-wider">
            Minha Carteira
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-2">
                A Receber
              </p>
              <p className="text-3xl font-bold text-blue-900">£0.00</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-2">
                Pago
              </p>
              <p className="text-3xl font-bold text-green-900">£0.00</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
              <p className="text-[10px] uppercase tracking-widest text-yellow-600 font-bold mb-2">
                Bônus
              </p>
              <p className="text-3xl font-bold text-yellow-900">£0.00</p>
            </div>
          </div>
        </Card>

        {/* Meus Trabalhos */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-[#0c1b33] uppercase tracking-[0.2em] border-l-4 border-[#D4AF37] pl-4">
            Meus Trabalhos
          </h2>

          {isLoading ? (
            <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              Carregando...
            </div>
          ) : !myJobs || myJobs.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              Você ainda não possui trabalhos agendados.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-all border-l-4 border-l-[#D4AF37] p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#0c1b33]">
                          {job.title}
                        </h3>
                        <Badge
                          variant={
                            job.status === "confirmed"
                              ? "default"
                              : job.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                          className="uppercase text-[10px] font-bold tracking-wider"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 tracking-wide uppercase font-light">
                        {new Date(job.eventDate).toLocaleDateString()} •{" "}
                        {job.location}
                      </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex gap-3">
                      <Button variant="outline" className="text-[10px] uppercase font-bold tracking-wider border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                        Ver Detalhes
                      </Button>
                      <Button variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        Check-in
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Calendário de Disponibilidade */}
        <Card className="mt-12 border-[#D4AF37]/30 shadow-xl bg-white p-8">
          <h2 className="text-2xl font-bold text-[#0c1b33] mb-6 uppercase tracking-wider">
            Minha Disponibilidade
          </h2>
          <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-200 text-center text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm uppercase tracking-wider">
              Calendário de disponibilidade em breve
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
