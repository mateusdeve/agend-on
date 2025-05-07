"use client"

import Link from "next/link"
import { useState } from "react"
import { Phone, Menu, X, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">HealthClinic</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/agendar" className="text-sm font-medium transition-colors hover:text-primary">
            Agende sua consulta
          </Link>
          <Link href="/sobre" className="text-sm font-medium transition-colors hover:text-primary">
            Sobre nós
          </Link>
          <Link href="/especialidades" className="text-sm font-medium transition-colors hover:text-primary">
            Especialidades
          </Link>
          <Link href="/contato" className="text-sm font-medium transition-colors hover:text-primary">
            Contate-nos
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm">(11) 9999-9999</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
          <ThemeToggle />
          <Button asChild variant="default" size="sm">
            <Link href="/login">Área do Paciente</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background",
          isMenuOpen ? "slide-in-from-top-80" : "hidden",
        )}
      >
        <div className="flex flex-col space-y-4">
          <Link
            href="/agendar"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Agende sua consulta
          </Link>
          <Link
            href="/sobre"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre nós
          </Link>
          <Link
            href="/especialidades"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Especialidades
          </Link>
          <Link
            href="/contato"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Contate-nos
          </Link>
          <div className="flex items-center gap-2 pt-4">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm">(11) 9999-9999</span>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
          <Button asChild variant="default" className="mt-4">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              Área do Paciente
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
