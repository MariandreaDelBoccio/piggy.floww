import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  HomeIcon,
  TruckIcon,
  HeartIcon,
  CakeIcon,
  CreditCardIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import type { CategoryIconProps } from "../../../types/types";

const iconsMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  food: CakeIcon,               
  shopping: ShoppingBagIcon,   
  debt: CreditCardIcon,        
  fun: FaceSmileIcon,         
  home: HomeIcon,              
  clothes: HeartIcon,          
  health: CurrencyDollarIcon,  
  transport: TruckIcon,        
};

const CategoryIcon = ({ id, className }: CategoryIconProps) => {
  const IconComponent = iconsMap[id] || ShoppingBagIcon;
  return <IconComponent className={className} />;
};

export default CategoryIcon;
