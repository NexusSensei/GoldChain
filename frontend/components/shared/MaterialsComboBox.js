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

const MATERIALS = [
  {
    value: "0",
    label: "Or",
  },
  {
    value: "1",
    label: "Argent",
  },
  {
    value: "2",
    label: "Platine",
  },
  {
    value: "3",
    label: "Palladium",
  },
  {
    value: "4",
    label: "Titane",
  },
  {
    value: "5",
    label: "Rhodium",
  },
  {
    value: "6",
    label: "Cuivre",
  },
  {
    value: "7",
    label: "Autre",
  },
]

export function ComboboxMaterials( { setMaterial }) {
  const [open, setOpen] = React.useState(false)
  const [valueMaterial, setValueMaterial] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {valueMaterial
            ? MATERIALS.find((material) => material.value === valueMaterial)?.label
            : "Materiau..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {MATERIALS.map((material) => (
                <CommandItem
                  key={material.value}
                  value={material.value}
                  onSelect={(currentValue) => {
                    setValueMaterial(currentValue === valueMaterial ? "" : currentValue)
                    setMaterial(currentValue)
                    setOpen(false)
                  }}
                >
                  {material.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      valueMaterial === material.value ? "opacity-100" : "opacity-0"
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
