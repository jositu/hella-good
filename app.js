d3.csv('survey_results_public.csv', (data) => {
    originalData = data.filter(hasRequiredFields);
    initBarsData(originalData);
    initSankeyData(originalData);
    initPcoordsData(originalData);
  
    initBars(originalData);
    initSankey(originalData);
    initPcoords(originalData);
  });