"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const CERTIFICATESTATUS = [
    {
    value: "0",
    label: "Créé",
    },
  {
    value: "1",
    label: "Transféré 1 fois",
  },
  {
    value: "2",
    label: "Transféré 2 fois ou plus",
  },
  {
    value: "3",
    label: "Perdu",
  },
  {
    value: "4",
    label: "Volé",
  },
]

export function ComboboxCertificateStatus( { setCertificateStatus }) {
  const [open, setOpen] = React.useState(false)
  const [valueCertificateStatus, setValueCertificateStatus] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
            {valueCertificateStatus
            ? CERTIFICATESTATUS.find((certificateStatus) => certificateStatus.value === valueCertificateStatus)?.label
            : "Statut du certificat..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {CERTIFICATESTATUS.map((certificateStatus) => (
                <CommandItem
                  key={certificateStatus.value}
                  value={certificateStatus.value}
                  onSelect={(currentValue) => {
                    setValueCertificateStatus(currentValue === valueCertificateStatus ? "" : currentValue)
                    setCertificateStatus(currentValue)
                    setOpen(false)
                  }}
                >
                {certificateStatus.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      valueCertificateStatus === certificateStatus.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
