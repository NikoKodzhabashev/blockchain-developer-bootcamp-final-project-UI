import smartContract from "./contract.js";
import { useMetaMask } from "metamask-react";
import {
  Button,
  Grid,
  CardActions,
  Typography,
  Container,
} from "@mui/material";
import Campaign from "./Campaign.jsx";
import React from "react";
import { ToastContainer, toast } from "react-toastify";

const MyCampaigns = () => {
  const [fundRaises, setFundRaises] = React.useState([]);
  const { account } = useMetaMask();

  React.useEffect(() => {
    (async () => {
      const result = await smartContract().getAllCampaignsByAddress({
        sender: account,
      });
      setFundRaises(result);
    })();
  }, []);

  const withdrawTheAmount = async (campaignId) => {
    try {
      const result = await smartContract().withdraw(campaignId);
      toast.success("Successfully withdrawn the amount.");
    } catch (error) {
      toast.error(
        error.data.message,
        "Something went wrong. Please try again."
      );
      console.log(error.data.message);
    }
  };
  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom textAlign="center">
          Your Campaigns
        </Typography>
        <Grid container spacing={2}>
          {fundRaises.map((fundRaise) => {
            return (
              <Campaign
                fundRaise={fundRaise}
                action={
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        withdrawTheAmount(fundRaise.id);
                      }}
                    >
                      Withdraw
                    </Button>
                  </CardActions>
                }
              />
            );
          })}
        </Grid>
      </Container>
      <ToastContainer />
    </>
  );
};

export default MyCampaigns;
