import React, { FC, useEffect, useMemo } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import QueueIcon from "@mui/icons-material/Queue";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import InventoryIcon from "@mui/icons-material/Inventory";
import VerifiedIcon from "@mui/icons-material/Verified";
import ViewListIcon from "@mui/icons-material/ViewList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import List from "@mui/material/List";
import { useAppSelector } from "../../../store/hooks";
import { IUser } from "../../../shared/interfaces/userInterfaces";
import { useNavigate, useLocation } from "react-router-dom";

interface IItem {
  name: string;
  index: number;
}

function generateItemsForUser(user: IUser): IItem[] | null {
  if (!user.isVerified) {
    return null;
  }
  let index = 0;
  let items: IItem[] = [];
  items.push({ name: "Products", index: index++ });

  if (user.userType === "BUYER") {
    items.push({ name: "Checkout", index: index++ });
    items.push({ name: "Active orders", index: index++ });
    items.push({ name: "History", index: index++ });
    return items;
  }

  if (user.userType === "SELLER") {
    items.push({ name: "New product", index: index++ });
    items.push({ name: "My products", index: index++ });
    items.push({ name: "New orders", index: index++ });
    items.push({ name: "My orders", index: index++ });
    return items;
  }

  if (user.userType === "ADMIN") {
    items.push({ name: "Verification", index: index++ });
    items.push({ name: "All orders", index: index++ });
    return items;
  }

  return null;
}

const icons = new Map<string, React.ReactNode>();
icons.set("Products", <StorefrontIcon />);
icons.set("Checkout", <ShoppingCartIcon />);
icons.set("Active orders", <AccessTimeIcon />);
icons.set("History", <ReceiptLongIcon />);
icons.set("New product", <QueueIcon />);
icons.set("My products", <LibraryBooksIcon />);
icons.set("New orders", <LocalMallIcon />);
icons.set("My orders", <InventoryIcon />);
icons.set("Verification", <VerifiedIcon />);
icons.set("All orders", <ViewListIcon />);

const NavigationList: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const user = useAppSelector((state) => state.user.user);
  const items = useMemo(() => {
    if (user !== null) {
      return generateItemsForUser(user);
    }
    return null;
  }, [user]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const buttonProps = (value: number) => ({
    selected: selectedIndex === value,
    onClick: () => {
      if (items !== null) {
        navigate("/" + items[value].name.toLowerCase().replace(" ", "-"));
      }
      setSelectedIndex(value);
    },
  });

  const content: React.ReactNode[] | undefined = items?.map((item) => {
    return (
      <ListItemButton key={item.index} {...buttonProps(item.index)}>
        <ListItemIcon>{icons.get(item.name)}</ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItemButton>
    );
  });

  useEffect(() => {
    if (pathname === "/profile" || pathname === "/change-password") {
      setSelectedIndex(-1);
      return;
    }

    if (items === null) {
      return;
    }

    if(pathname === "/")
    {
      setSelectedIndex(0);
      return;
    }

    const filteredItems = items.filter(
      (item) => "/" + item.name.toLowerCase().replace(" ", "-") === pathname
    );
    if (filteredItems.length === 0) {
      return;
    }

    setSelectedIndex(filteredItems[0].index);
  }, [pathname, items]);

  return <List component="nav">{content}</List>;
};

export default NavigationList;
