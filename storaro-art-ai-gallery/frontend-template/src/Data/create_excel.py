import pandas as pd

import json
with open(r"C:\Users\Alessio\Documents\Projects\Storaro Art\frontend-template\src\Data\images_analysis_short_script.json",'r') as f:
    content = json.load(f)
    
    
df = pd.DataFrame(content)

df.to_excel(r"C:\Users\Alessio\Documents\Projects\Storaro Art\frontend-template\src\Data\images_analysis_short_script.xlsx", index=False)