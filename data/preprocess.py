# import csv

# median_income_filename = 'MedianHouseholdIncome2015.csv'
# poverty_level_filename = 'PercentagePeopleBelowPovertyLevel.csv'
# education_level_filename = 'PercentOver25CompletedHighSchool.csv'
# police_killings_filename = 'PoliceKillingsUS.csv'
# diversity_filename = 'ShareRaceByCity.csv'

# state_data = {}
# city_data = {}

# with open(median_income_filename, 'r') as csvfile:
#     csvreader = csv.reader(csvfile)
#     a = csvreader.next()
#     print(a)

# state_data = {
#     'AL': {
#         'MedianHouseholdIncome': ,
#         'PovertyLevel': ,
#         'EducationLevel': ,
#         'White': ,
#         'Black': ,
#         'NativeAmerican': ,
#         'Asian': ,
#         'Hispanic': ,
#         'NumPoliceKillings': ,
#         'PoliceKillings': ,
#         'numEntries': ,
#     },
# }

# city_data = {
#     'mycity': {
#         'MedianHouseholdIncome': ,
#         'PovertyLevel': ,
#         'EducationLevel': ,
#         'White': ,
#         'Black': ,
#         'NativeAmerican': ,
#         'Asian': ,
#         'Hispanic': ,
#         'NumEntries': ,
#     },
# }

import pandas as pd 
import numpy as np

income = pd.read_csv('MedianHouseholdIncome2015.csv',encoding='iso-8859-1')
poverty = pd.read_csv('PercentagePeopleBelowPovertyLevel.csv',encoding='iso-8859-1')
race = pd.read_csv('ShareRaceByCity.csv',encoding='iso-8859-1')
hsEd = pd.read_csv('PercentOver25CompletedHighSchool.csv',encoding='iso-8859-1')


res = pd.merge(income,poverty,left_on=['Geographic Area','City'],right_on=['Geographic Area','City'])
res = pd.merge(hsEd,res,left_on=['Geographic Area','City'],right_on=['Geographic Area','City'])
res = pd.merge(res,race,left_on=['Geographic Area','City'],right_on=['Geographic area','City'])

res = res.replace('(x)', np.NaN)
res = res.replace('(X)', np.NaN)
res = res.dropna(how='any')
res = res.drop(columns = ['Geographic area'])
res.to_csv('result.csv',index=False)
