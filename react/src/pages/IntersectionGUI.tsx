import { FormEvent, useCallback, useState } from 'react';
import './IntersectionGUI.css'
import { intersect } from '../clients/Intersect';
import { generateRandomList } from '../components/randomListGenerator';
import { Alert, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { IntersectionResponse } from '../clients/models/IntersectionResponse';
import { background1, columnStyle, fillerStyle, leftAlignText, rowStyle } from '../components/styles';
import { ListDisplay } from '../components/listDisplay';

enum List {
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

  const [firstList, setFirstList] = useState<List>(List.A);

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
    setFirstList(value as List);
    resetResponse();
  }, []);

  const onClickIntersect = useCallback(async () => {
    try {
      setLoading(true);
      let intersection; 
      if (firstList === List.A) {
        intersection = await intersect(listA, listB);
      } else {
        intersection = await intersect(listB, listA);
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
    <>
      <h1>Intersection Tool</h1>
      <p>
        This tool allows you to caclulate intersections of random lists.
      </p>
      <Paper sx={{...columnStyle, width: "1000px"}}>
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
        {
          hasTwoLists && (
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
                    <FormControlLabel value={List.A} control={<Radio />} label="List A" />
                    <FormControlLabel value={List.B} control={<Radio />} label="List B" />
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
    </>
  )
}

export default IntersectionGUI
