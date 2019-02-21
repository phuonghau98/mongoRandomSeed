import numpy as np
import matplotlib.pyplot as plt
 
# data to plot
n_groups = 4
means_withIndex = (83, 321, 2407, 25958) 
means_withoutIndex = (86, 225, 847, 6510)
 
# create plot
fig, ax = plt.subplots()
index = np.arange(n_groups)
bar_width = 0.35
opacity = 0.8
 
rects1 = plt.bar(index, means_withIndex, bar_width,
alpha=opacity,
color='b',
label='with index')
 
rects2 = plt.bar(index + bar_width, means_withoutIndex, bar_width,
alpha=opacity,
color='g',
label='without index')
 
plt.xlabel('Số dòng')
plt.ylabel('Thời gian thực hiện truy vấn (milisecond)')
plt.title('Thống kê truy vấn db.collection.insertMany() kết hợp với tạo index')
plt.xticks(index + bar_width, ('1000', '10,000', '100,000', '1,000,000'))
plt.legend()
 
plt.tight_layout()
plt.show()
