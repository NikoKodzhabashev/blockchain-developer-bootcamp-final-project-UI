import { utils } from "ethers/";
import { Typography, Grid, CardMedia, Card, CardContent } from "@mui/material";

const Campaign = ({ fundRaise, isCompleted, action }) => {
  return (
    <Grid item xs={4}>
      <Card variant="outlined">
        <CardContent>
          <CardMedia
            component="img"
            height="194"
            image={`https://gateway.pinata.cloud/ipfs/${fundRaise.ipfsHash}`}
          />
          <Typography
            sx={{ fontSize: 14, marginTop: "4px" }}
            color="text.secondary"
            gutterBottom
          >
            <span style={{ marginRight: "4px", marginTop: "4px" }}>
              Expire in:
            </span>
            {new Date(
              parseInt(fundRaise.expireOf._hex) * 1000
            ).toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            Status: {isCompleted ? "Completed" : "Active"}
          </Typography>

          <Typography variant="h5">{fundRaise.title}</Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Goal: {utils.formatEther(fundRaise.goal)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Current amount: {utils.formatEther(fundRaise.currentAmount)}
          </Typography>
          <Typography variant="body2">{fundRaise.description}</Typography>
        </CardContent>
        <>{action}</>
      </Card>
    </Grid>
  );
};

export default Campaign;
