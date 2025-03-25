'use client'

// shadcn
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


const AddProfile = () => {



  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Tabs defaultValue="Client" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Client">Client</TabsTrigger>
          <TabsTrigger value="Bijoutier">Bijoutier</TabsTrigger>
        </TabsList>
        <TabsContent value="Client">
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
              <CardDescription>
                Consultez la marcket-place et gérez vos certificats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nom & Prénom</Label>
                <Input id="name" defaultValue="votre nom..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="votremail@golchain.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="Adresse">Adresse</Label>
                <Input id="Adresse" defaultValue="Paris" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Créer profil client</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Bijoutier">
          <Card>
            <CardHeader>
              <CardTitle>Bijoutier</CardTitle>
              <CardDescription>
                Créez des certificats, ajoutez vos bijoux à la marcket-place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="Name">Dénomination sociale</Label>
                <Input id="Name" defaultValue="votre dénomination..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="votremail@golchain.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="Adresse">Adresse</Label>
                <Input id="Adresse" defaultValue="Paris" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Créer profil bijoutier</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
  }
  
  export default AddProfile