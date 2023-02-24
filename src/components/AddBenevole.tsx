import {UserProps} from "./App"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import {useNavigate, useParams} from "react-router-dom"
import {useState, useEffect} from "react"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

function AddBenevole({user, setUser, setOpen}:UserProps) {

    const navigate = useNavigate()

    const {id} = useParams()

    const [benevole, setBenevole] = useState({benevole_nom:"",benevole_prenom:"",benevole_mail:"",benevole_id:0})

    const [initial, setInitial] = useState({benevole_nom:"",benevole_prenom:"",benevole_mail:"",benevole_id:0})

    async function getBenevole() {
        if (id !== undefined) {
            const res = await fetch(`http://localhost:5000/benevole/${id}`, {
                method: "GET"
            })
            const parseRes = await res.json()
            setBenevole(parseRes)
            setInitial(parseRes)
            setShow(true)
        }
    }

    useEffect(() => {
      if (id !== undefined) {
        getBenevole()
      }
      else {
        setShow(true)
      }
    },[])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const body = {nom:benevole.benevole_nom,prenom:benevole.benevole_prenom,mail:benevole.benevole_mail}
        if (id === undefined) {
            const res = await fetch("http://localhost:5000/benevole", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            if (res.status === 401) {
              setUser({polyuser_id:0,polyuser_nom:"",polyuser_prenom:"",polyuser_mail:"",polyuser_role:""})
              setOpen(true)
            }
        }
        else {
            const res = await fetch(`http://localhost:5000/benevole/${id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            if (res.status === 401) {
              setUser({polyuser_id:0,polyuser_nom:"",polyuser_prenom:"",polyuser_mail:"",polyuser_role:""})
              setOpen(true)
            }
        }
        navigate("/benevoles")
    }

    const [show, setShow] = useState<boolean>(false)

    return (
        <Container maxWidth="xs"> {!show ? <Container sx={{display: 'flex',justifyContent: 'center',alignItems: 'center',height: '100vh'}}><CircularProgress/></Container> : <Container>
          <Typography variant="h4" style={{marginTop:"1rem",textAlign:"center",flexGrow:1}}>{id === undefined ? "Ajouter un bénévole" : `Modifier le bénévole : ${initial.benevole_prenom + " " + initial.benevole_nom}`}</Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={benevole.benevole_prenom}
                  onChange={(e) => setBenevole({...benevole,benevole_prenom:e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={benevole.benevole_nom}
                  onChange={(e) => setBenevole({...benevole,benevole_nom:e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={benevole.benevole_mail}
                  onChange={(e) => setBenevole({...benevole,benevole_mail:e.target.value})}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {id === undefined ? "AJOUTER" : "MODIFIER"}
            </Button>
          </Box></Container> }
        </Container>
    )
}

export default AddBenevole