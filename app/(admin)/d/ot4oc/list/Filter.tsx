import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'

const Filter = () => {
  return (
    <Button>
      <span className="hidden md:inline-block">Filter</span>
      <FilterIcon />
    </Button>
  )
}

export default Filter
