import React, {FC} from 'react';
import { Box, Typography, Slide } from "@mui/material";

interface IProps {
    title: string
}

const PageTitle: FC<IProps> = (props) => {
    return (
        <Box sx={{ width: "100%", marginLeft: "0 auto" }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box
          mb={2}
          sx={{
            borderRadius: "20px",
            padding: "2rem",
            textAlign: "center",
            ml: 40,
            mr: 40,
            boxShadow:
              "rgba(255, 255, 255, 0.25) 0px 1px 0px, rgba(27, 31, 35, 0.04) 0px 1px 0px inset",
          }}
        >
          <Typography component="h2" variant="h2" fontFamily={"cursive"}>
            {props.title}
          </Typography>
        </Box>
      </Slide>
    </Box>
    );
}

export default PageTitle;