#grabs city population sizes from uscitiesv1.3.csv 
import pandas as pd

cities = pd.read_csv("cityData1.csv",encoding="iso-8859-1")
populations = pd.read_csv("uscitiesv1.3.csv",encoding="iso-8859-1")
populations = populations[['state_id','city','population']]

#city column as 'city,town,cdp' attached so remove that
#also capitalize for easier comparison
cityCap = cities['City'].apply(lambda x: x.split()[0].upper())
cities['City'] = cityCap

hsEd = cities['percent_completed_hs'].apply(lambda x: (float(x))/100)
#cities['percent_completed_hs'] = hsEd

poverty = cities['poverty_rate'].apply(lambda x: (float(x))/100)
#cities['poverty_rate'] = hsEd

white = cities['share_white'].apply(lambda x: (float(x))/100)
#cities['share_white'] = hsEd

black = cities['share_black'].apply(lambda x: (float(x))/100)
#cities['share_black'] = hsEd

na = cities['share_native_american'].apply(lambda x: (float(x))/100)
#cities['share_native_american'] = hsEd

asian = cities['share_asian'].apply(lambda x: (float(x))/100)
#cities['share_asian'] = hsEd

hisp = cities['share_hispanic'].apply(lambda x: (float(x))/100)
#cities['share_hispanic'] = hsEd



popCap = populations['city'].str.upper()
populations['city'] = popCap




res = pd.merge(cities,populations,left_on=['Geographic Area','City'],right_on=['state_id','city'],how="left")
res = res.dropna(how='any')
res = res.drop(columns = ['state_id','city'])


res['actual_completed_hs'] = hsEd*res['population']
res['actual_poverty_rate'] = poverty*res['population']
res['actual_share_white'] = white*res['population']
res['actual_share_black'] = black*res['population']
res['actual_share_native_american'] = na*res['population']
res['actual_share_asian'] = asian*res['population']
res['actual_share_hispanic'] = hisp*res['population']


res.to_csv('cityData.csv',index=False)


