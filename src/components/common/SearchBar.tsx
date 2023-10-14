import { FC } from 'react'

import { Input } from '../ui/input'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  return <Input type="text" placeholder="Search..." className="w-60" />
}

export default SearchBar
