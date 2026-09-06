@echo off
title Creation du ZIP - Bank Simulator

echo ---------------------------------------
echo Creation de bank-simulator.zip
echo ---------------------------------------

REM Suppression de l'ancien ZIP s'il existe
if exist bank-simulator.zip del bank-simulator.zip

REM Creation du ZIP avec PowerShell (Windows 10+)
powershell -Command "Compress-Archive -Path ^
index.html,^
dashboard.html,^
virement.html,^
historique.html,^
ajouter-beneficiaire.html,^
mes-cartes.html,^
rib.html,^
profil.html,^
manage.html,^
styles.css,^
shared.js ^
-DestinationPath bank-simulator.zip -Force"

if exist bank-simulator.zip (
    echo.
    echo ✅ ZIP cree avec succes : bank-simulator.zip
) else (
    echo.
    echo ❌ Erreur lors de la creation du ZIP
)

echo.
pause
