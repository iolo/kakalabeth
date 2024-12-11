cat kaka6.utf8.txt | node .\utf8_to_3327.js > kaka6.3327.txt 
cat kaka6.3327.txt | java -jar applecommander-ac-1.9.0.jar -bas kaka6.dsk -bas kaka6
applewin.exe .\kaka6.dsk
