import "./App.css";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  Box,
  CardActions,
  CardContent,
  Tooltip,
  Chip,
  Stack,
  Modal,
  TextField,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import smartContract from "./contract.js";
import { pinFileToIPFS } from "./pinataReq";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { status, connect, account } = useMetaMask();
  const [fundRaises, setFundRaises] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [file, setFile] = React.useState(null);
  const onSubmit = async (data) => {
    setLoading(true);

    const res = await pinFileToIPFS(file);
    await smartContract().createCampaign(
      new Date(data.expireOf).getTime(),
      data.goal,
      data.title,
      data.description,
      res.data.IpfsHash
    );
    setLoading(false);
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isWalletLoading =
    status === "notConnected" ||
    status === "initializing" ||
    status === "connecting";

  React.useEffect(() => {
    (async () => {
      const result = await smartContract().getAllCampaigns();
      console.log(result);
      setFundRaises(result);
    })();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom textAlign="center">
        Welcome! We are happy to have you here!
      </Typography>
      <Box textAlign="center" mb={5} display="flex" justifyContent="center">
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
          return (
            <Grid item xs={4}>
              <Card
                variant="outlined"
                onClick={() => {
                  navigate(`/fundarise/${1}`);
                }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Expire in:
                    {new Date(parseInt(fundRaise.expireOf._hex)).toDateString()}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {fundRaise.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Goal: {parseInt(fundRaise.goal._hex)}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Current amount: {parseInt(fundRaise.currentAmount._hex)}
                  </Typography>
                  <Typography variant="body2">
                    {fundRaise.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
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
                  type="date"
                  required
                  label={"Expire of"}
                  error={Boolean(errors.expireOf)}
                  value={value}
                  onChange={onChange}
                  helperText={errors.expireOf ? errors.expireOf.message : null}
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
            <Button type="submit">Submit</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}

export default App;
