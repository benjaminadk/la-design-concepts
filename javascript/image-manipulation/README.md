# Image Resizer

A quick and dirty test of [Jimp]() JPEG resizer

## Test Case

|      Criteria       |    Value    |
| :-----------------: | :---------: |
|     Image Count     |     431     |
|  Input Dimensions   |   600x600   |
| Input Size(folder)  |    47MB     |
|  Output Dimensions  |   800x800   |
| Output Size(folder) |   33.6MB    |
|    JPEG Quality     |     50      |
|        Time         | 115 seconds |
|    Time s/image     |    .25s     |

## Conclusion

- May be a faster alternative to Photoshop for simple image processing
- Should be turned into a CLI tool
  - Navigate to dir with images
  - Type `resize` or whatever
  - Program will create new sub dir for output
  - Possible to expand to take user input for directories as well
