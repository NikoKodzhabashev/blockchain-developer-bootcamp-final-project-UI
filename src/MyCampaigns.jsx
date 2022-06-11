import smartContract from "./contract.js";
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

  React.useEffect(() => {
    (async () => {
      const result = await smartContract().getAllCampaignsByAddress();
      setFundRaises(result);
    })();
  }, []);

  React.useEffect(() => {
    smartContract().on("FundRaiseWithdraw", () => {
      (async () => {
        const result = await smartContract().getAllCampaignsByAddress();
        setFundRaises(result);
      })();
    });
  }, []);

  const withdrawTheAmount = async (campaignId) => {
    try {
      await smartContract().withdraw(campaignId);
      toast.success(
        "Successfully withdrawn the amount. Please wait for the transaction to be mined."
      );
    } catch (error) {
      toast.error(
        error.data.message,
        "Something went wrong. Please try again."
      );
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
            const isCompleted =
              new Date().getTime() >=
                parseInt(fundRaise.expireOf._hex) * 1000 ||
              fundRaise.status === 1;

            return (
              <Campaign
                key={fundRaise.id}
                fundRaise={fundRaise}
                isCompleted={isCompleted}
                action={
                  <CardActions>
                    {isCompleted ? (
                      <Button
                        size="small"
                        onClick={() => {
                          withdrawTheAmount(fundRaise.id);
                        }}
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Typography
                        variant="overline"
                        display="block"
                        gutterBottom
                        ml={2}
                      >
                        Can't be withdrawn
                      </Typography>
                    )}
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
