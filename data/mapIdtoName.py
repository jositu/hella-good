import pandas as pd 

df = pd.read_csv('us-state-names.tsv',sep='\t');
for row in df.rows:
    print(row)