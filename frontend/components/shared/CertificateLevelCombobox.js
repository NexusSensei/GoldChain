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

const CERTIFICATELEVELS = [
    {
    value: "0",
    label: "Aucun",
    },
  {
    value: "1",
    label: "Document",
  },
  {
    value: "2",
    label: "Puce NFC",
  },
  {
    value: "3",
    label: "Puce RFID",
  },
]

export function ComboboxCertificateLevel( { setCertificateLevel }) {
  const [open, setOpen] = React.useState(false)
  const [valueCertificateLevel, setValueCertificateLevel] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
            {valueCertificateLevel
            ? CERTIFICATELEVELS.find((certificateLevel) => certificateLevel.value === valueCertificateLevel)?.label
            : "Niveau du certificat..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {CERTIFICATELEVELS.map((certificateLevel) => (
                <CommandItem
                  key={certificateLevel.value}
                  value={certificateLevel.value}
                  onSelect={(currentValue) => {
                    setValueCertificateLevel(currentValue === valueCertificateLevel ? "" : currentValue)
                    setCertificateLevel(currentValue)
                    setOpen(false)
                  }}
                >
                {certificateLevel.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      valueCertificateLevel === certificateLevel.value ? "opacity-100" : "opacity-0"
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
