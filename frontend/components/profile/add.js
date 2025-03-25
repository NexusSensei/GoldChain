'use client'

// shadcn
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




const AddProfile = () => {



    return (
      <div className="flex justify-center items-center p-10">
        <Card className="w-2/3">
            <CardHeader>
                <CardTitle className="flex justify-center items-center">Choisissez un rôle :</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="px-4 py-2 text-blue-600 hover:text-blue-800">Bijoutier</Link>
                    <Link href="/marcketplace" className="px-4 py-2 text-blue-600 hover:text-blue-800">Client</Link>
                </div>
            </CardContent>
        </Card>
      </div>
    )
  }
  
  export default AddProfile