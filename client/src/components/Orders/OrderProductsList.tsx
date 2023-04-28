import React, {FC} from 'react';
import { IProduct } from '../../shared/interfaces/productsInterfaces';
import { Box, Badge, Tooltip, Avatar } from '@mui/material';

interface IProps {
    items: IProduct[]
    sellerId: string
}

const OrderProductsList: FC<IProps> = (props) => {
    return (
        <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: "10px",
                width: "100%",
              }}
            >
              {props.items.map((product) => (
                <Badge badgeContent={product.amount} color="primary" sx={{}}>
                  <Tooltip title={product.name}>
                    <Avatar
                      alt="pic"
                      src={product.imageSource}
                      sx={
                        product.seller.id === props.sellerId
                          ? { border: "5px solid green" }
                          : {}
                      }
                    />
                  </Tooltip>
                </Badge>
              ))}
            </Box>
    );
}

export default OrderProductsList;