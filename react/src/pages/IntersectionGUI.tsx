import { FormEvent, useCallback, useState } from 'react';
import { intersect } from '../clients/Intersect';
import { generateRandomList } from '../components/randomListGenerator';
import { Alert, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { IntersectionResponse } from '../clients/models/IntersectionResponse';
import { background1, columnStyle, fillerStyle, leftAlignText, rowStyle } from '../components/styles';
import { ListDisplay } from '../components/ListDisplay';
import nameLogotype from "../../public/nameLogotype.svg"; 

enum ListName {
  A = "A",
  B = "B"
}

function IntersectionGUI() {

  /**
   * State
   */
  const [lengthListA, setLengthListA] = useState<number|null>(10);
  const [lengthListB, setLengthListB] = useState<number|null>(15000);

  const [listA, setListA] = useState<string[]|null>(null);
  const [listB, setListB] = useState<string[]|null>(null);

  const [firstList, setFirstList] = useState<ListName>(ListName.A);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [intersectionResponse, setIntersectionResponse] = useState<IntersectionResponse|null>(null);


  /**
   * Reset response
   */
  const resetResponse = () => {
    setIntersectionResponse(null);
    setErrorMessage(null);
  }


  /**
   * Callbacks
   */
  const onChangeListALength = useCallback((event: FormEvent) => {
    setLengthListA(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListA]);

  const onChangeListBLength = useCallback((event: FormEvent) => {
    setLengthListB(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListB]);

  const onGenerateLists = useCallback(() => {
    setListA(generateRandomList(lengthListA as number));
    setListB(generateRandomList(lengthListB as number));
    resetResponse();
  }, [setListB, setListA, lengthListA, lengthListB]);
  
  const onSelectFirstList = useCallback((event: FormEvent) => {
    const value = (event?.target as HTMLInputElement).defaultValue
    setFirstList(value as ListName);
    resetResponse();
  }, [setFirstList]);

  const onClickIntersect = useCallback(async () => {
    resetResponse();
    try {
      setLoading(true);
      let intersection; 
      if (firstList === ListName.A) {
        intersection = await intersect(listA as string[], listB as string[]);
      } else {
        intersection = await intersect(listB as string[], listA as string[]);
      }
      setIntersectionResponse(intersection);
    } catch (error: any) {
      setIntersectionResponse(null);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [setIntersectionResponse, listA, listB, firstList]);


  /**
   * Render
   */
  const hasTwoNumbers: boolean = typeof(lengthListA) === "number" && typeof(lengthListB) === "number"; 
  
  const hasTwoLists: boolean = !!listA && !!listB;

  return (
    <Box sx={{...columnStyle, ...background1, padding: "40px", width: "100%", height: "100%", boxSizing: "border-box"}}>
      <img style={{width: "500px"}} src={nameLogotype}/>
      <Typography sx={leftAlignText}>
        This tool allows you to caclulate intersections of random lists.
      </Typography>
      <Paper sx={{...columnStyle, width: "1000px"}}>
        
        {/* List setup */}
        <Box sx={{...rowStyle}}>
          <TextField
            inputProps={{ type: 'number'}}
            label="List A Length"
            type="number"
            onChange={onChangeListALength}
            value={lengthListA ? lengthListA : ""}/>
          <TextField 
            label="List B Length"
            inputProps={{ type: 'number'}}
            onChange={onChangeListBLength}
            value={lengthListB ? lengthListB : ""}/>
          <Button disabled={!hasTwoNumbers} 
            onClick={onGenerateLists}>
            Generate Lists
          </Button>
        </Box>
        { listA && 
          <ListDisplay name="List A" list={listA}/>
        }
        { listB && 
          <ListDisplay name="List B" list={listB}/>
        }

        {/* Send parameters */}
        { hasTwoLists && (
            <>
              <Box>
                <FormControl sx={{...rowStyle, alignItems: "center"}}>
                  <FormLabel id="demo-radio-buttons-group-label">List dedicated for hash table.</FormLabel>
                  <RadioGroup sx={rowStyle}
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={firstList}
                    onChange={onSelectFirstList}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value={ListName.A} control={<Radio />} label="List A" />
                    <FormControlLabel value={ListName.B} control={<Radio />} label="List B" />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={rowStyle}>
                <Box sx={fillerStyle}/>
                <Button variant="contained"
                  onClick={onClickIntersect}>
                  Calculate Intersection
                </Button>
              </Box>
            </>
          )
        }

        {/* Response */}
        <Box sx={{minHeight: "200px", ...columnStyle}}>
          { isLoading && (
            <CircularProgress/>
          )}
          { !isLoading && hasTwoLists && 
            <>
              {errorMessage && 
                <Alert severity='error'>{errorMessage}</Alert>}
              {intersectionResponse && (
                <>
                  <ListDisplay name="Intersection" list={intersectionResponse.intersection}/>
                  <Typography sx={leftAlignText}>Calculation time: {intersectionResponse.calculationTimeMs}ms</Typography>
                </>
              )}        
            </>
          }
        </Box>
      </Paper>
    </Box>
  )
}

export default IntersectionGUI
