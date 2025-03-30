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

const GEMSSTONES = [
    {
    value: "0",
    label: "Aucune",
    },
  {
    value: "1",
    label: "Diamant",
  },
  {
    value: "2",
    label: "Saphir",
  },
  {
    value: "3",
    label: "Rubis",
  },
  {
    value: "4",
    label: "Emeraude",
  },
  {
    value: "5",
    label: "Autre",
  },
]

export function ComboboxGemsStones( { setGemstone }) {
  const [open, setOpen] = React.useState(false)
  const [valueGemstone, setValueGemstone] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
            {valueGemstone
            ? GEMSSTONES.find((gemstone) => gemstone.value === valueGemstone)?.label
            : "Pierre précieuse..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {GEMSSTONES.map((gemstone) => (
                <CommandItem
                  key={gemstone.value}
                  value={gemstone.value}
                  onSelect={(currentValue) => {
                    setValueGemstone(currentValue === valueGemstone ? "" : currentValue)
                    setGemstone(currentValue)
                    setOpen(false)
                  }}
                >
                  {gemstone.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      valueGemstone === gemstone.value ? "opacity-100" : "opacity-0"
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
