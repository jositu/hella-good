import csv

median_income_filename = 'MedianHouseholdIncome2015.csv'
poverty_level_filename = 'PercentagePeopleBelowPovertyLevel.csv'
education_level_filename = 'PercentOver25CompletedHighSchool.csv'
police_killings_filename = 'PoliceKillingsUS.csv'
diversity_filename = 'ShareRaceByCity.csv'

state_data = {}
city_data = {}

with open(median_income_filename, 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    a = csvreader.next()
    print(a)

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
