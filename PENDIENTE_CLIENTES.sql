SELECT dbo.FCRMVP.FCRMVP_MODAPL + dbo.FCRMVP.FCRMVP_CODAPL + CONVERT(VARCHAR, dbo.FCRMVP.FCRMVP_NROAPL) 
+ ISNULL(dbo.FCRMVP.USR_FCRMVP_ESTPCK, 'A') AS ID, 
dbo.FCRMVP.FCRMVP_MODAPL AS MODFOR, 
dbo.FCRMVP.FCRMVP_CODAPL AS CODFOR, 
dbo.FCRMVP.FCRMVP_NROAPL AS NROFOR, 
dbo.FCRMVH.FCRMVH_FCHMOV AS FCHMOV, 
dbo.FCRMVH.USR_FCRMVH_SITIOS AS SITIOS, 
dbo.USR_SITIOS.USR_SITIOS_DESCRP AS SITDES, 
dbo.FCRMVH.FCRMVH_CIRCOM AS CIRCOM, 
dbo.FCRMVP.FCRMVP_DEPOSI AS DEPOSI, 
dbo.FCRMVH.FCRMVH_NROCTA AS NROCTA, 
dbo.VTMCLH.VTMCLH_NOMBRE AS NOMBRE, 
dbo.GRTTRA.GRTTRA_TRACOD AS TRACOD, 
dbo.GRTTRA.GRTTRA_DESCRP AS TRADES, 
dbo.FCRMVP.USR_FCRMVP_ESTPCK AS ESTPCK, 
dbo.FCRMVP.USR_FCRMVP_ESTPK2 AS ESTPK2, 
SUM(dbo.FCRMVP.FCRMVP_CANTID) AS CANTID, 
SUM(dbo.FCRMVP.USR_FCRMVP_CNTPK2) 
AS CNTPK2, 
ISNULL((SELECT TOP (1) USRPK2 
        FROM dbo.PCK_PENDIENTE_PRODUCTO AS P
		WHERE (MODFOR = dbo.FCRMVP.FCRMVP_MODAPL) 
		AND (CODFOR = dbo.FCRMVP.FCRMVP_CODAPL) 
		AND (NROFOR = dbo.FCRMVP.FCRMVP_NROAPL) 
		AND (ESTPCK = 'B') 
		AND (USRPK2 IS NOT NULL) AND (USRPK2 <> '') AND CNTFST  = 0), '') AS USRPK2
FROM dbo.FCRMVH 
INNER JOIN dbo.FCRMVP ON dbo.FCRMVH.FCRMVH_MODFOR = dbo.FCRMVP.FCRMVP_MODAPL 
						AND dbo.FCRMVH.FCRMVH_CODFOR = dbo.FCRMVP.FCRMVP_CODAPL 
						AND dbo.FCRMVH.FCRMVH_NROFOR = dbo.FCRMVP.FCRMVP_NROAPL 												
INNER JOIN dbo.VTMCLH ON dbo.FCRMVH.FCRMVH_NROCTA = dbo.VTMCLH.VTMCLH_NROCTA 
INNER JOIN dbo.GRTTRA ON dbo.FCRMVH.FCRMVH_TRACOD = dbo.GRTTRA.GRTTRA_TRACOD 
INNER JOIN dbo.USR_SITIOS ON dbo.USR_SITIOS.USR_SITIOS_CODIGO = dbo.FCRMVH.USR_FCRMVH_SITIOS
WHERE (dbo.FCRMVP.FCRMVP_TIPPRO BETWEEN '000' AND '999') 
AND (dbo.FCRMVH.FCRMVH_CIRCOM IN ('0250', '0260')) 
AND (dbo.FCRMVH.FCRMVH_FCHMOV > DATEADD(DAY, - 3, GETDATE())) 
AND (dbo.FCRMVP.USR_FCRMVP_ESTPCK = 'B') 
AND (dbo.FCRMVP.USR_FCRMVP_ESTPK2 = 'A') 
AND (NOT EXISTS(SELECT * FROM dbo.PCK_PENDIENTE_PRODUCTO AS P WHERE (MODFOR = dbo.FCRMVP.FCRMVP_MODAPL) AND (CODFOR = dbo.FCRMVP.FCRMVP_CODAPL) AND (NROFOR = dbo.FCRMVP.FCRMVP_NROAPL) AND ((ESTPCK = 'A') or (CNTPCK = 0 AND CNTFST > 0))))
GROUP BY dbo.FCRMVP.FCRMVP_MODAPL, 
dbo.FCRMVP.FCRMVP_CODAPL, 
dbo.FCRMVP.FCRMVP_NROAPL, 
dbo.FCRMVH.FCRMVH_FCHMOV, 
dbo.FCRMVH.USR_FCRMVH_SITIOS, 
dbo.USR_SITIOS.USR_SITIOS_DESCRP, 
dbo.FCRMVH.FCRMVH_CIRCOM, 
dbo.FCRMVP.FCRMVP_DEPOSI, 
dbo.FCRMVH.FCRMVH_NROCTA, 
dbo.VTMCLH.VTMCLH_NOMBRE, 
dbo.GRTTRA.GRTTRA_TRACOD, 
dbo.GRTTRA.GRTTRA_DESCRP, 
dbo.FCRMVP.USR_FCRMVP_ESTPCK, 
dbo.FCRMVP.USR_FCRMVP_ESTPK2
HAVING (SUM(dbo.FCRMVP.FCRMVP_CANTID) > 0)