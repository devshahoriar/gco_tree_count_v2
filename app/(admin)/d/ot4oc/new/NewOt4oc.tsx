/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/lib/auth-client'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Content from './Contact'
import Details from './Details'
import MasterRoll from './MasterRoll'
import MatiInfo from './MatiInfo'

const initialData = {
  // Master Roll fields
  childName: '',
  fatherName: '',
  village: '',
  phone: '',
  tree_count: 0,
  masterId: '',
  subNumber: false,

  // Details fields
  childGender: '',
  childBirthDate: '',
  fatherBirthDate: '',
  fatherNid: '',
  fatherJob: '',
  fatherEdu: '',
  motherName: '',
  motherBirthDate: '',
  motherNid: '',
  motherJob: '',
  motherEdu: '',
  religion: '',
  deliveryInfo: '',
  deliveryChildHealth: '',
  familyIncome: '',

  // Contact fields
  email: '',
  wordNo: '',
  divisionId: undefined,
  zillaId: undefined,
  upZillaId: undefined,
  unionId: undefined,
  postId: undefined,

  // Maternity Info fields
  treePlantDate: new Date(),
  whoPlanName: '',
  bornWeek: '',
  bornWeight: '',
  thChild: '',
  childBornPlace: '',
  motherContractExpart: '',
  howManyTimeContractExpart: '',
  motherFreedomVisitExpert: '',
  motherSeriousSick: '',
  preventCozToGoExpert: '',
  whereIsMotherWhenPregnant: '',
}

const NewOt4oc = ({ allDivi, upOt4oc }: { allDivi: any; upOt4oc: any }) => {
  const [tab, setTab] = useState('masterRoll')
  const [baby, setbaby] = useState(upOt4oc || initialData)
  const { data } = useSession()

  const setUser = () => {
    setbaby((prev: any) => ({
      ...prev,
      whoPlanName: data?.user?.name,
    }))
  }

  useEffect(() => {
    if (data?.user && !baby?.whoPlanName) {
      setUser()
    }
  }, [data?.user])

  return (
    <section>
      <div className="flex justify-between items-center">
        <p className="font-bold">One Tree for One Child</p>
        <div className="flex items-center gap-2">
          <Button>
            <Search />
            <span className="hidden md:inline">Search</span>
          </Button>
          <Button
            onClick={() => {
              setbaby(initialData)
              setUser()
            }}
          >
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
            <TabsTrigger value="contant">Contact</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="matinfo">
              Maternity <span className="hidden md:inline">-information</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="masterRoll">
            {tab === 'masterRoll' && (
              <MasterRoll setTab={setTab} baby={baby} setBaby={setbaby} />
            )}
          </TabsContent>
          <TabsContent value="contant">
           
            {tab === 'contant' && (
              <Content
                setTab={setTab}
                allDivi={allDivi}
                baby={baby}
                setBaby={setbaby}
              />
            )}
          </TabsContent>
          <TabsContent value="details">
            {tab === 'details' && (
              <Details setTab={setTab} baby={baby} setBaby={setbaby} />
            )}
          </TabsContent>
          <TabsContent value="matinfo">
            {tab === 'matinfo' && <MatiInfo baby={baby} setBaby={setbaby} />}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default NewOt4oc
