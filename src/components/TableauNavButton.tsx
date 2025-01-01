import { Button } from "@chakra-ui/react"
import { BiLeftArrow, BiRightArrow } from "react-icons/bi"

type TableauNavButtonProps = {
  direction: 'left' | 'right'
  onClick: () => void
  height: number
  disabled?: boolean
}

export const TableauNavButton = ({ direction, onClick, height, disabled }: TableauNavButtonProps) => {
  return (
    <Button onClick={onClick} variant="subtle" size="md" height={height} disabled={disabled} maxW={60}>
      {direction === 'left' ? <BiLeftArrow /> : <BiRightArrow />}
    </Button>
  )
}