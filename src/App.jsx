import "./App.css";
import {
  Typography,
  Button,
  Grid,
  Container,
  Box,
  CardActions,
  Tooltip,
  Chip,
  Stack,
  Modal,
  TextField,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { utils } from "ethers";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import smartContract from "./contract.js";
import { pinFileToIPFS } from "./pinataReq";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Campaign from "./Campaign";

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const truncateEthAddress = (address) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

function App() {
  const { status, connect, account } = useMetaMask();
  const [fundRaises, setFundRaises] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [donateId, setDonateId] = React.useState(null);
  const [file, setFile] = React.useState(null);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await pinFileToIPFS(file);
      await smartContract().createCampaign(
        new Date(data.expireOf).getTime() / 1000,
        utils.parseEther(data.goal),
        data.title,
        data.description,
        res.data.IpfsHash
      );
      toast.success(
        "Successfully created new campaign. Please wait for the transaction to be mined."
      );
    } catch (error) {
      toast.error(
        error.error.data.originalError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmitDonate = async (data) => {
    setLoading(true);

    try {
      await smartContract().donate(donateId, {
        value: utils.parseEther(data.amount),
      });
      toast.success(
        "Successfully donated to the campaign. Please wait for the transaction to be mined."
      );
    } catch (error) {
      debugger;
      toast.error(
        error.error.data.originalError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setOpen(false);
      setDonateId(null);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const {
    handleSubmit: handleSubmitDonate,
    control: controlDonate,
    formState: { errors: errorsDonate },
  } = useForm();

  const isWalletLoading =
    status === "notConnected" ||
    status === "initializing" ||
    status === "connecting";

  const setCampaigns = async () => {
    const campaigns = await smartContract().getAllCampaigns();
    const myCampaigns = await smartContract().getAllCampaignsByAddress();
    const ids = myCampaigns.map((campaign) => parseInt(campaign.id));
    const filtratedCampaigns = campaigns.filter(
      (campaign) => !ids.includes(parseInt(campaign.id))
    );
    setFundRaises(filtratedCampaigns);
  };
  React.useEffect(() => {
    (async () => {
      if (account) {
        await setCampaigns();
      }
    })();
  }, [account]);

  React.useEffect(() => {
    smartContract()
      .on("FundRaiseCreate", () => {
        (async () => {
          await setCampaigns();
        })();
      })
      .on("FundRaiseDonate", () => {
        (async () => {
          await setCampaigns();
        })();
      });
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom textAlign="center">
          Welcome! We are happy to have you here!
        </Typography>
        <Box
          textAlign="center"
          mb={5}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {isWalletLoading ? (
            <Button variant="contained" onClick={connect}>
              {status === "connecting" ? "Connecting..." : "Connect MetaMask"}
            </Button>
          ) : (
            <Stack>
              <Tooltip title={account} enterDelay={500} leaveDelay={200}>
                <Chip
                  label={truncateEthAddress(account)}
                  color="primary"
                  variant="outlined"
                  style={{ background: "#f9f9f9" }}
                  size="small"
                />
              </Tooltip>
            </Stack>
          )}
          <Button
            variant="contained"
            style={{ marginTop: "10px" }}
            onClick={() => {
              navigate("/my-campaigns");
            }}
          >
            My Campaigns
          </Button>
        </Box>

        <Box display="flex" mb={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Fund Raises
            </Typography>
          </Box>

          <Box ml={3}>
            <Button variant="outlined" onClick={handleOpen}>
              Add Campaign
            </Button>
          </Box>
        </Box>

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
                    <Button
                      size="small"
                      disabled={isCompleted}
                      onClick={() => {
                        setDonateId(fundRaise.id);
                      }}
                    >
                      Donate
                    </Button>
                  </CardActions>
                }
              />
            );
          })}
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Campaign information
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "400px",
                justifyContent: "space-around",
              }}
            >
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{
                  required: "Title is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    label={"Title"}
                    error={Boolean(errors.title)}
                    value={value}
                    onChange={onChange}
                    helperText={errors.title ? errors.title.message : null}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{
                  required: "Description is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    label={"Description"}
                    error={Boolean(errors.description)}
                    value={value}
                    onChange={onChange}
                    helperText={
                      errors.description ? errors.description.message : null
                    }
                  />
                )}
              />
              <Controller
                name="goal"
                control={control}
                defaultValue=""
                rules={{
                  required: "Goal is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    type="number"
                    required
                    label={"Goal"}
                    error={Boolean(errors.goal)}
                    value={value}
                    onChange={onChange}
                    helperText={errors.goal ? errors.goal.message : null}
                  />
                )}
              />
              <Controller
                name="expireOf"
                control={control}
                defaultValue=""
                rules={{
                  required: "Expire of is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    type="datetime-local"
                    required
                    label={"Expire of"}
                    error={Boolean(errors.expireOf)}
                    value={value}
                    onChange={onChange}
                    helperText={
                      errors.expireOf ? errors.expireOf.message : null
                    }
                  />
                )}
              />
              <Controller
                name="image"
                control={control}
                defaultValue=""
                rules={{
                  required: "Image of is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    type="file"
                    label={"Image"}
                    error={Boolean(errors.image)}
                    value={value}
                    onChange={(event) => {
                      onChange(event);
                      setFile(event.target.files[0]);
                    }}
                    helperText={errors.image ? errors.image.message : null}
                  />
                )}
              />
              <LoadingButton type="submit" loading={loading}>
                Submit
              </LoadingButton>
            </form>
          </Box>
        </Modal>
        <Modal
          open={!!donateId}
          onClose={() => {
            setDonateId(null);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Thank you!
            </Typography>
            <form
              onSubmit={handleSubmitDonate(onSubmitDonate)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "150px",
                justifyContent: "space-around",
              }}
            >
              <Controller
                name="amount"
                control={controlDonate}
                rules={{
                  required: "Amount is required",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    type="number"
                    label={"Amount"}
                    error={Boolean(errorsDonate.amount)}
                    value={value}
                    onChange={onChange}
                    helperText={
                      errorsDonate.amount ? errorsDonate.amount.message : null
                    }
                  />
                )}
              />
              <LoadingButton type="submit" loading={loading}>
                Submit
              </LoadingButton>
            </form>
          </Box>
        </Modal>
      </Container>
      <ToastContainer />
    </>
  );
}

export default App;
