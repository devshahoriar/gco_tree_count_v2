/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import Content from './Contact'
import Details from './Details'
import MasterRoll from './MasterRoll'
import MatiInfo from './MatiInfo'

const NewOt4oc = ({ allDivi }: { allDivi: any }) => {
  const [tab, setTab] = useState('masterRoll')
  return (
    <section>
      <div className="flex justify-between items-center">
        <p className="font-bold">One Tree for One Child</p>
        <div className="flex items-center gap-2">
          <Button>
            <Search />
            <span className="hidden md:inline">Search</span>
          </Button>
          <Button>
            <X />
            <span className="hidden md:inline">Reset</span>
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <Tabs
          onValueChange={setTab}
          value={tab}
          defaultValue="masterRoll"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="masterRoll">Master roll</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contant">Contact</TabsTrigger>
            <TabsTrigger value="matinfo">
              Maternity <span className="hidden md:inline">-information</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="masterRoll">
            {tab === 'masterRoll' && <MasterRoll setTab={setTab} />}
          </TabsContent>
          <TabsContent value="details">
            {tab === 'details' && <Details setTab={setTab} />}
          </TabsContent>
          <TabsContent value="contant">
            {tab === 'contant' && <Content setTab={setTab} allDivi={allDivi} />}
          </TabsContent>
          <TabsContent value="matinfo">
            {tab === 'matinfo' && <MatiInfo />}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default NewOt4oc
